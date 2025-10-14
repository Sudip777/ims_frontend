import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concatMap, map, pipe, throwError } from 'rxjs';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { createEffect } from 'ngxtension/create-effect';
import { AuthService } from '../services/api';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';

export interface TokenDecoded {
  id: string;
  username: string;
  iat: number;
  exp: number;
  role: string;
}

export interface AuthPayload {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private auth = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  token = injectLocalStorage<string | null>('token', {
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
          this.router.navigateByUrl('/dashboard');
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
        this.auth.login(payload).pipe(
          map((response) => {
            this.token.set(response.token);

            // ✅ Success toast
            this.messageService.add({
              severity: 'success',
              summary: 'Login Successful',
              detail: `Welcome, ${payload.username}!`,
              life: 3000,
            });

            this.router.navigateByUrl('/dashboard/overview');
            return response;
          }),
          catchError((err: HttpErrorResponse) => {
            // ✅ Typed error
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
}
