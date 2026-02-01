import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { ProductService, type CreateProductPayload, type UpdateProductPayload } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import type { Product } from '../../models/product.model';
import type { Category } from '../../models/category.model';
import type { Inventory } from '../../models/inventory.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private inventoryService = inject(InventoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  categories: Category[] = [];
  loading = false;
  saving = false;
  error = '';
  isEdit = false;
  productId: number | null = null;
  private loadTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: [null as number | null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      status: [true],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
    });

    this.categoryService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.error = 'Error al cargar categorías'),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam != null && idParam !== '') {
      const id = Number(idParam);
      if (Number.isFinite(id) && id > 0) {
        this.isEdit = true;
        this.productId = id;
        this.loadProduct(this.productId);
      } else {
        this.loading = false;
        this.error = 'ID de producto no válido.';
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.loadTimeout != null) clearTimeout(this.loadTimeout);
  }

  private loadProduct(id: number): void {
    const done = (): void => {
      if (this.loadTimeout != null) {
        clearTimeout(this.loadTimeout);
        this.loadTimeout = null;
      }
      this.loading = false;
      this.cdr.markForCheck();
    };

    this.loading = true;
    this.error = '';
    this.loadTimeout = setTimeout(() => {
      this.loadTimeout = null;
      if (this.loading) {
        this.loading = false;
        this.error = 'Tiempo de espera agotado. Comprueba que el backend esté en ejecución (puerto 3000).';
        this.cdr.markForCheck();
      }
    }, 10000);

    this.productService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          try {
            const categoryId = product.categoryId ?? (product as { category?: { id: number } }).category?.id ?? null;
            this.form.patchValue({
              name: product.name ?? '',
              sku: product.sku ?? '',
              categoryId: categoryId,
              price: Number(product.price) || 0,
              status: product.status !== false,
              currentStock: 0,
              minStock: 0,
            });
            done();
            this.inventoryService
              .getByProductId(id)
              .pipe(
                takeUntil(this.destroy$),
                catchError(() => of({ currentStock: 0, minStock: 0 } as Inventory)),
              )
              .subscribe({
                next: (inv) => {
                  this.form.patchValue({
                    currentStock: inv?.['currentStock'] ?? 0,
                    minStock: inv?.['minStock'] ?? 0,
                  });
                  this.cdr.markForCheck();
                },
              });
          } catch (e) {
            this.error = 'Error al mostrar los datos del producto.';
            done();
          }
        },
        error: (err) => {
          this.error = err.error?.message ?? err.message ?? 'Error al cargar producto. Comprueba que el backend esté en ejecución (puerto 3000).';
          done();
        },
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const value = this.form.getRawValue();
    const categoryId = value.categoryId != null ? Number(value.categoryId) : null;

    if (this.isEdit && this.productId) {
      const updatePayload: UpdateProductPayload = {
        name: value.name,
        sku: value.sku,
        categoryId: categoryId ?? undefined,
        price: Number(value.price),
        status: value.status,
        currentStock: Number(value.currentStock),
        minStock: Number(value.minStock),
      };
      this.productService.update(this.productId, updatePayload).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.showSuccessAndNavigate(),
        error: (err) => {
          this.error = err.error?.message ?? 'Error al guardar';
          this.saving = false;
        },
      });
    } else {
      const createPayload: CreateProductPayload = {
        name: value.name,
        sku: value.sku,
        categoryId: categoryId!,
        price: Number(value.price),
        status: value.status,
        currentStock: Number(value['currentStock']),
        minStock: Number(value['minStock']),
      };
      this.productService.create(createPayload).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.showSuccessAndNavigate(),
        error: (err) => {
          this.error = err.error?.message ?? 'Error al guardar';
          this.saving = false;
        },
      });
    }
  }

  private showSuccessAndNavigate(): void {
    const message = this.isEdit
      ? 'Producto actualizado correctamente'
      : 'Producto registrado correctamente';
    this.snackBar.open(message, 'Cerrar', { duration: 4000 });
    this.saving = false;
    this.router.navigate(['/inventory']);
  }
}
