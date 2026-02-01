import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ProductService } from '../../../../core/services/product.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import type { Product } from '../../models/product.model';
import type { Inventory } from '../../models/inventory.model';

export interface ProductWithStock extends Product {
  currentStock: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['name', 'sku', 'category', 'stock', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<ProductWithStock>([]);
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      products: this.productService.getAll(),
      inventory: this.inventoryService.getAll().pipe(
        catchError(() => of([] as Inventory[])),
      ),
    })
      .pipe(
        map(({ products, inventory }) => {
          const list = Array.isArray(products) ? products : [];
          const invByProduct = new Map<number, number>();
          inventory.forEach((inv) =>
            invByProduct.set(inv.productId, inv['currentStock']),
          );
          return list.map((p) => ({
            ...p,
            currentStock: invByProduct.get(p.id!) ?? 0,
          })) as ProductWithStock[];
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (data) => {
          this.dataSource.data = Array.isArray(data) ? data : [];
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = err.error?.message ?? err.message ?? 'Error al cargar productos';
        },
      });
  }

  editProduct(product: ProductWithStock): void {
    const id = product?.id != null ? Number(product.id) : NaN;
    if (!Number.isFinite(id)) return;
    this.router.navigate(['/inventory', 'edit', id]);
  }

  deleteProduct(product: ProductWithStock, event: Event): void {
    event.stopPropagation();
    if (!product.id || !confirm(`¿Eliminar "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.error = err.error?.message ?? 'Error al eliminar';
      },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(Number(price));
  }
}
