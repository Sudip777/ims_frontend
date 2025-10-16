import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthStore } from '../store/auth-store';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private authStore: AuthStore) {}

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

  get<T>(url: string, params?: any): Observable<T> {
    return this.http
      .get<T>(`${environment.apiUrl}${url}`, {
        headers: this.getHeaders(),
        params,
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            console.error('Unauthorized - Token may be invalid or expired');
          }
          return throwError(() => err);
        })
      );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  put<T>(url: string, body: any): Observable<T> {
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
