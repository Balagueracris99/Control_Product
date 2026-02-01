import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserItem {
  id: number;
  name: string;
  email: string;
  role?: string;
  status: boolean;
  created_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserItem[]> {
    return this.http.get<UserItem[]>(this.baseUrl);
  }

  create(data: CreateUserRequest): Observable<UserItem> {
    return this.http.post<UserItem>(this.baseUrl, data);
  }

  update(id: number, data: UpdateUserRequest): Observable<UserItem> {
    return this.http.patch<UserItem>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
