import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { OnboardingComponent } from './features/onboarding/components/onboarding';
import { Login } from './features/auth/components/login/login';
import { DashboardOverview } from './features/dashboard/components/dashboard-overview/dashboard-overview';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { ProductDetail } from './features/products/components/product-detail/product-detail';
import { SupplierDetail } from './features/supplier/components/supplier-detail/supplier-detail';
import { CategoryDetail } from './features/category/components/category-detail/category-detail';
import { WarehouseDetail } from './features/warehouse/components/warehouse-detail/warehouse-detail';

export const routes: Routes = [
  { path: '', component: MainLayout }, // Landing
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'login', component: Login },

  {
    path: 'dashboard',
    component: DashboardLayout, // Contains sidebar + router-outlet
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'overview', component: DashboardOverview },
      { path: 'product', component: ProductDetail },
      { path: 'supplier', component: SupplierDetail },
      { path: 'category', component: CategoryDetail },
      { path: 'warehouse', component: WarehouseDetail },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
