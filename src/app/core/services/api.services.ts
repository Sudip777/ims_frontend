import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { AuthStore } from '../store/auth-store';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);

  private getHeaders(): HttpHeaders {
    const token = this.authStore.token();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers = headers.set('Authorization', formattedToken);
    } else {
      console.warn('No authentication token available');
    }

    return headers;
  }

  get<T>(url: string, options?: { params?: HttpParams }): Observable<T> {
    return this.http
      .get<T>(`${environment.apiUrl}${url}`, {
        headers: this.getHeaders(),
        params: options?.params,
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            console.error('Unauthorized - Token may be invalid or expired');
          }
          return throwError(() => err);
        }),
      );
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${url}`, body, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${url}`, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }
}
