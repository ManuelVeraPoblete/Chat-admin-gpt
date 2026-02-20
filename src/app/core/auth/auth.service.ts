import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app-config';

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user?: { id: string; email: string; role?: string };
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly token$ = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /**
   * ✅ Verifica sesión local en memoria.
   * - Si usas cookie HttpOnly y token sólo vía refresh, puedes adaptar esto
   *   a "user != null" o "hasSessionCookie" si aplica.
   */
  isAuthenticated(): boolean {
    return !!this.token$.value;
  }

  getToken(): string | null {
    return this.token$.value;
  }

  /**
   * Login clásico (si tu backend entrega accessToken)
   */
  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.config.apiBaseUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((res) => this.token$.next(res.accessToken)),
        map(() => true),
        catchError(() => of(false)),
      );
  }

  /**
   * Refresh silencioso (si tu backend soporta refreshToken cookie / endpoint refresh)
   */
  refresh(): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.config.apiBaseUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res) => this.token$.next(res.accessToken)),
        map(() => true),
        catchError(() => {
          this.token$.next(null);
          return of(false);
        }),
      );
  }

  /**
   * Logout
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.config.apiBaseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.token$.next(null)),
        catchError(() => {
          this.token$.next(null);
          return of(void 0);
        }),
      );
  }
}
