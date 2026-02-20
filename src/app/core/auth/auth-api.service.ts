import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly url = `${API_CONFIG.baseUrl}/auth/login`;

  constructor(private readonly http: HttpClient) {}

  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, dto);
  }
}
