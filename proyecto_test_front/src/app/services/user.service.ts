import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(data: LoginDto): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN';
  }

  isEmployee(): boolean {
    return this.getUser()?.role === 'EMPLOYEE';
  }
}