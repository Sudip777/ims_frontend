import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '../../../../shared/components/text-field/text-field';
import { IconComponent } from '../../../../shared/icons/components/icon.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, TextFieldComponent, ReactiveFormsModule, IconComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  loginForm: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
