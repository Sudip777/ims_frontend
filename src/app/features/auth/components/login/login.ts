import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '../../../../shared/icons/components/icon.component';
import { TextFieldComponent } from '../../../../shared/components/text-field/text-field';
import { AuthRoutingModule } from '../../auth-routing-module';
import { AuthStore } from '../../../../core/auth/store/auth-store';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldComponent,
    IconComponent,
    AuthRoutingModule,
    ToastModule,
    HttpClientModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  // === State ===
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  // === Injected Services ===
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // === Form Field Validation ===
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // === Login Handler ===
  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;
    console.log(username, password, 'asas');

    // ✅ Correct usage for current ngxtension version
    this.authStore.login({ username, password });

    // Optional loading animation delay
    setTimeout(() => (this.isLoading = false), 800);
  }
}
