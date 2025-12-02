import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../store/auth-store';

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);

  const accessToken = authStore.token();

  const authReq = accessToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Already refreshing → queue requests
      if (isRefreshing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Observable<HttpEvent<any>>((observer) => {
          refreshQueue.push((newToken: string) => {
            observer.next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any
            );
            observer.complete();
          });
        });
      }

      // Begin refresh process
      isRefreshing = true;

      return authService.refreshToken().pipe(
        switchMap((res) => {
          const newToken = res.result.access_token;
          authStore.token.set(newToken);

          // Retry queued requests
          refreshQueue.forEach((cb) => cb(newToken));
          refreshQueue = [];
          isRefreshing = false;

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          authStore.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
