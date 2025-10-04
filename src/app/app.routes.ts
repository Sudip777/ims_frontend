import { Routes } from '@angular/router';
import { OnboardingComponent } from './features/onboarding/components/onboarding';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './features/auth/components/login/login';


export const routes: Routes = [
  { path: '', component: MainLayout },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'login', component: Login },
];
