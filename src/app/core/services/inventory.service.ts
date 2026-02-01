import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Inventory, InventoryMovement, MovementType } from '../../modules/inventory/models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.baseUrl);
  }

  getByProductId(productId: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.baseUrl}/product/${productId}`);
  }

  update(productId: number, data: { currentStock?: number; minStock?: number }): Observable<Inventory> {
    return this.http.patch<Inventory>(`${this.baseUrl}/product/${productId}`, data);
  }

  createMovement(data: { productId: number; type: MovementType; quantity: number; reason?: string }): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(`${this.baseUrl}/movements`, data);
  }

  getMovements(productId?: number): Observable<InventoryMovement[]> {
    const url = productId ? `${this.baseUrl}/movements?productId=${productId}` : `${this.baseUrl}/movements`;
    return this.http.get<InventoryMovement[]>(url);
  }
}
