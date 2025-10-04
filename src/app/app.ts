import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from "./layout/main-layout/main-layout";
import { OnboardingComponent } from "./features/onboarding/components/onboarding";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayout, OnboardingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('inventory-management-system');
}
