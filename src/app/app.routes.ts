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
import { CustomerDetail } from './features/customer/components/customer-detail/customer-detail';
import { PurchaseOrderDetail } from './features/purchase-order/components/purchase-order-detail/purchase-order-detail';
import { SalesOrderDetail } from './features/sales-order/components/sales-order-detail/sales-order-detail';
import { InventoryDetail } from './features/inventory/components/inventory-detail/inventory-detail';

export const routes: Routes = [
  { path: '', component: MainLayout },
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
      { path: 'customer', component: CustomerDetail },
      { path: 'purchase-order', component: PurchaseOrderDetail },
      { path: 'sales-order', component: SalesOrderDetail },
      { path: 'inventory', component: InventoryDetail },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
