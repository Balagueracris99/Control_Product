import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryService } from '../../../../core/services/category.service';
import type { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  dataSource = new MatTableDataSource<Category>([]);
  loading = false;
  saving = false;
  error = '';

  displayedColumns = ['name', 'description', 'status', 'actions'];

  constructor() {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.categoryService.getAll().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const message = err.error?.message ?? 'Error al cargar categorías';
        this.loading = false;
        setTimeout(() => {
          this.error = message;
        }, 0);
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
    this.categoryService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({ name: '', description: '', status: true });
        this.load();
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const message = err.error?.message ?? 'Error al guardar';
        this.saving = false;
        setTimeout(() => {
          this.error = message;
        }, 0);
      },
    });
  }

  delete(cat: Category, event: Event): void {
    event.stopPropagation();
    if (!cat.id || !confirm(`¿Eliminar categoría "${cat.name}"?`)) return;
    this.categoryService.delete(cat.id).subscribe({
      next: () => {
        this.load();
        this.cdr.detectChanges();
      },
      error: (err) => {
        const message = err.error?.message ?? 'Error al eliminar';
        setTimeout(() => {
          this.error = message;
        }, 0);
      },
    });
  }
}
