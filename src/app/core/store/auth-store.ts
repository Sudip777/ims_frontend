import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concatMap, map, pipe, throwError } from 'rxjs';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { createEffect } from 'ngxtension/create-effect';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthPayload, AuthService } from '../services/auth.services';
import { TokenDecoded } from '../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  token = injectLocalStorage<string | null>('accessToken', {
    storageSync: true,
  });

  isAuthenticated = computed(() => !!this.token());
  tokenDecoded = computed(() => {
    const token = this.token();
    return token ? this.decodeToken(token) : null;
  });

  constructor() {
    // Watch token and route accordingly
    explicitEffect(
      [this.token],
      ([token]) => {
        if (token) {
          this.router.navigateByUrl('/dashboard/overview');
        } else {
          this.router.navigateByUrl('/login');
        }
      },
      { defer: true }
    );
  }

  /** Decode a JWT token */
  private decodeToken(token: string): TokenDecoded | null {
    try {
      return jwtDecode<TokenDecoded>(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /** Effect: login flow */
  login = createEffect<AuthPayload>(
    pipe(
      concatMap((payload) =>
        this.authService.login(payload).pipe(
          map((response) => {
            const token = response.result.access_token;
            this.token.set(token);

            this.messageService.add({
              severity: 'success',
              summary: 'Login Successful',
              detail: `Welcome, ${payload.username}!`,
              life: 3000,
            });

            return response;
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.messageService.add({
                severity: 'error',
                summary: 'Authentication Failed',
                detail: 'Invalid username or password.',
                life: 4000,
              });
            } else if (err.status === 0) {
              this.messageService.add({
                severity: 'error',
                summary: 'Server Unreachable',
                detail: 'Cannot connect to API. Please try again later.',
                life: 4000,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error?.message || 'An unexpected error occurred.',
                life: 3000,
              });
            }

            return throwError(() => err);
          })
        )
      )
    )
  );

  /** Log out and clear token */
  logout() {
    this.token.set(null);
    this.router.navigateByUrl('/login');
  }

  private roleMap: Record<string, string> = {
    '8': 'Super_Admin',
    '7': 'Support ',
    '6': 'Warehouse',
    '5': 'Sales',
    '4': 'Manager',
    '1': 'Admin',
  };
  userId = computed(() => {
    const decoded = this.tokenDecoded();
    return decoded?.UserId || null;
  });
  username = computed(() => {
    const decoded = this.tokenDecoded();
    const username = decoded?.Username || null;
    if (!username) return null;
    return username.charAt(0).toUpperCase() + username.slice(1);
  });

  userRole = computed(() => {
    const decoded = this.tokenDecoded();
    return this.roleMap[decoded?.RoleId ?? ''] ?? 'UNKNOWN';
  });
}
