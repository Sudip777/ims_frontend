import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { createEffect } from 'ngxtension/create-effect';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';
import { catchError, concatMap, map, pipe, throwError } from 'rxjs';
import { TokenDecoded } from '../models/token.model';
import { AuthPayload, AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
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
            const accessToken = response.result.access_token;
            this.token.set(accessToken);
            this.notificationService.success('Login Successfull', `Welcome, ${payload.username}!`);

            // backend sets refresh cookie automatically
            this.router.navigateByUrl('/dashboard/overview');
            return response;
          }),

          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.notificationService.error('Login Failed', 'Invalid Username or Password');
            } else if (err.status === 500) {
              this.notificationService.error('Server Unreachable ', 'Cannot connect to API. Please try again later.');
            } else {
              this.notificationService.error('Error', err.error?.message || 'An unexpected error occured');
            }

            return throwError(() => err);
          })
        )
      )
    )
  );

  // Refresh Access Token
  refresh() {
    return this.authService.refreshToken().pipe(
      map((res) => {
        const newAccess = res.result.access_token;
        this.token.set(newAccess);
        return newAccess;
      })
    );
  }

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
