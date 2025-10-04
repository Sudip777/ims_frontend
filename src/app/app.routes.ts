import { Routes } from '@angular/router';
import { OnboardingComponent } from './features/onboarding/components/onboarding';
import { MainLayout } from './layout/main-layout/main-layout';


export const routes: Routes = [
  { path: '', component: MainLayout },
  { path: 'onboarding', component: OnboardingComponent },
];
