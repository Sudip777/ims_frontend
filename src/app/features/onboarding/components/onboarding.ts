import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/icons/components/icon.component';
import { ButtonComponent } from '../../../shared/components/button/button';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Footer } from '../../../layout/footer/footer';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ButtonComponent,
    InputTextModule,
    FloatLabel,
    RadioButtonModule,
  ],
  templateUrl: './onboarding.html',
})
export class OnboardingComponent {
  onboardingForm: FormGroup;
  private router = inject(Router);

  businessTypes = [
    { value: 'super-stockiest', label: 'Super-stockiest' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'brand', label: 'Brand' },
  ];

  skuSizes = [
    { value: '<500', label: '<500 units' },
    { value: '501-1000', label: '501-1000 units' },
    { value: '1001-5000', label: '1001-5000 units' },
    { value: '5001-10000', label: '5001-10000 units' },
    { value: '10001-25000', label: '10001-25000 units' },
    { value: '>25000', label: '>25000 units' },
  ];
  size: any;

  constructor(private fb: FormBuilder) {
    this.onboardingForm = this.fb.group({
      businessName: ['', Validators.required],
      industry: ['', Validators.required],
      domain: ['', Validators.required],
      productService: ['', Validators.required],
      businessType: ['', Validators.required],
      skuSize: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.onboardingForm.valid) {
      console.log('Form submitted:', this.onboardingForm.value);
      // Handle form submission
    } else {
      Object.keys(this.onboardingForm.controls).forEach((key) => {
        this.onboardingForm.get(key)?.markAsTouched();
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.onboardingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  navigateLogin() {
    console.log('Sign is Clickedd');

    this.router.navigate(['/login']);
  }
}
