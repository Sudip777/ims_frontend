import { Component } from '@angular/core';
import { IconComponent } from '../../../../shared/icons/components/icon.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '../../../../shared/components/text-field/text-field';
import { AuthRoutingModule } from '../../auth-routing-module';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    TextFieldComponent,
    ReactiveFormsModule,
    IconComponent,
    AuthRoutingModule,
    HttpClientModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    // Fixed URL with protocol
    const apiUrl = 'https://localhost:7024/api/auth/login';

    console.log('Attempting login with:', { username });

    this.http.post<any>(apiUrl, { username, password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;

        // Store authentication token if provided
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        // Navigate to dashboard or home page
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        this.isLoading = false;

        // Handle different error scenarios
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the API is running.';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else if (error.status === 404) {
          this.errorMessage = 'API endpoint not found.';
        } else {
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        }

        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error,
        });
      },
      complete: () => {
        console.log('Login request completed');
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
