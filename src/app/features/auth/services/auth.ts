import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) {}

  // signUp() {
  //   const url = 'https://localhost:7024/api/auth/login';
  //   return this.http.post(url);
  // }
}
