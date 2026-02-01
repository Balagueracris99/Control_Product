import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService, type UserItem, type CreateUserRequest, type UpdateUserRequest } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  form: FormGroup;
  dataSource = new MatTableDataSource<UserItem>([]);
  loading = false;
  saving = false;
  error = '';
  editingUserId: number | null = null;

  displayedColumns = ['name', 'email', 'role', 'status', 'created_at', 'actions'];

  constructor() {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', [Validators.required]],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.userService.getAll().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Error al cargar usuarios';
        this.loading = false;
      },
    });
  }

  startEdit(user: UserItem): void {
    this.editingUserId = user.id;
    this.form.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role ?? 'USER',
      status: user.status,
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.form.reset({ name: '', email: '', password: '', role: 'USER', status: true });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.editingUserId != null) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser(): void {
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const data: CreateUserRequest = this.form.getRawValue();
    this.userService.create(data).subscribe({
      next: () => {
        this.form.reset({ name: '', email: '', password: '', role: 'USER', status: true });
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Error al crear usuario';
        this.saving = false;
      },
    });
  }

  private updateUser(): void {
    if (!this.editingUserId) return;
    const raw = this.form.getRawValue();
    if (!raw.name?.trim() || !raw.email?.trim()) {
      this.form.markAllAsTouched();
      return;
    }
    const data: UpdateUserRequest = {
      name: raw.name,
      email: raw.email,
      role: raw.role,
      status: raw.status,
    };
    if (raw.password && raw.password.length >= 6) {
      data.password = raw.password;
    }
    this.saving = true;
    this.error = '';
    this.userService.update(this.editingUserId, data).subscribe({
      next: () => {
        this.editingUserId = null;
        this.form.reset({ name: '', email: '', password: '', role: 'USER', status: true });
        this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Error al actualizar usuario';
        this.saving = false;
      },
    });
  }

  deleteUser(user: UserItem, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar al usuario "${user.name}" (${user.email})?`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error = err.error?.message ?? 'Error al eliminar usuario';
      },
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es');
  }
}
