import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { Product } from '../../modules/inventory/models/product.model';

/** Payload para crear producto (incluye stock). */
export interface CreateProductPayload {
  name: string;
  sku: string;
  categoryId: number;
  price: number;
  status?: boolean;
  currentStock?: number;
  minStock?: number;
}

/** Payload para actualizar producto (campos opcionales). */
export interface UpdateProductPayload {
  name?: string;
  sku?: string;
  categoryId?: number;
  price?: number;
  status?: boolean;
  currentStock?: number;
  minStock?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      map((body) => (Array.isArray(body) ? body : (body as { data?: Product[] })?.data ?? [])),
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<unknown>(`${this.baseUrl}/${id}`).pipe(
      map((body) => this.normalizeProduct(Array.isArray(body) ? null : (body as Record<string, unknown>))),
    );
  }

  private normalizeProduct(raw: Record<string, unknown> | null): Product {
    if (!raw || typeof raw !== 'object') {
      return { name: '', sku: '', categoryId: 0, price: 0, status: true };
    }
    const data = (raw as { data?: Record<string, unknown> })['data'] ?? raw;
    const p = data as Record<string, unknown>;
    return {
      id: Number(p['id']) || undefined,
      name: String(p['name'] ?? ''),
      sku: String(p['sku'] ?? ''),
      categoryId: Number(p['categoryId'] ?? (p['category'] as { id?: number })?.id ?? p['category_id'] ?? 0),
      category: p['category'] as Product['category'],
      price: Number(p['price'] ?? 0),
      status: p['status'] !== false && p['status'] !== 'false',
      createdAt: (p['createdAt'] as string) ?? (p['created_at'] as string),
    };
  }

  create(product: CreateProductPayload): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, {
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      price: product.price,
      status: product.status ?? true,
      currentStock: product.currentStock ?? 0,
      minStock: product.minStock ?? 0,
    });
  }

  update(id: number, product: UpdateProductPayload): Observable<Product> {
    const body: Record<string, unknown> = {};
    if (product.name !== undefined) body['name'] = product.name;
    if (product.sku !== undefined) body['sku'] = product.sku;
    if (product.categoryId !== undefined) body['categoryId'] = product.categoryId;
    if (product.price !== undefined) body['price'] = product.price;
    if (product.status !== undefined) body['status'] = product.status;
    const currentStock = product['currentStock'];
    const minStock = product['minStock'];
    if (currentStock !== undefined) body['currentStock'] = currentStock;
    if (minStock !== undefined) body['minStock'] = minStock;
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
