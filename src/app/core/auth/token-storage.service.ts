import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly key = 'corpchat_admin_jwt';

  getToken(): string | null {
    try {
      return localStorage.getItem(this.key);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.key, token.trim());
    } catch {
      // no-op
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // no-op
    }
  }
}
