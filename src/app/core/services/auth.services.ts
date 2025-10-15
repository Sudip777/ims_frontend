import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// Add to your auth.service.ts or auth-store.ts

export interface LoginResult {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  result: LoginResult;
}

export interface AuthPayload {
  username: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  /**
   * Logs in the user with the provided credentials.
   * @param {AuthPayload} payload - The authentication payload containing username and password.
   * @returns {Observable<LoginResponse>} An observable containing the authentication token.
   */
  login(payload: AuthPayload): Observable<LoginResponse> {
    const path = `${environment.apiUrl}/auth/login`;
    return this.http.post<LoginResponse>(path, payload);
  }
}
