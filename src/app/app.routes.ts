import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: MainLayout },
  {
    path: 'onboarding',
    title: 'New User Onborading Management',
    loadComponent: () =>
      import('./features/onboarding/components/onboarding').then((m) => m.OnboardingComponent),
  },
  {
    path: 'login',
    title: 'User Management',
    loadComponent: () => import('./features/auth/components/login/login').then((m) => m.Login),
  },

  {
    path: 'dashboard',
    canActivateChild: [authGuard()],
    title: 'Dashboard Management',
    component: DashboardLayout,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        title: 'Dashboard Overview Management',
        loadComponent: () =>
          import('./features/dashboard/components/dashboard-overview/dashboard-overview').then(
            (m) => m.DashboardOverview,
          ),
      },
      {
        path: 'product',
        title: 'Product Management',
        loadComponent: () =>
          import('./features/products/components/product-detail/product-detail').then(
            (m) => m.ProductDetail,
          ),
      },
      {
        path: 'supplier',
        title: 'Supplier Management',
        loadComponent: () =>
          import('./features/supplier/components/supplier-detail/supplier-detail').then(
            (m) => m.SupplierDetail,
          ),
      },
      {
        path: 'category',
        title: 'Category Management',
        loadComponent: () =>
          import('./features/category/components/category-detail/category-detail').then(
            (m) => m.CategoryDetail,
          ),
      },
      {
        path: 'warehouse',
        title: 'Warehouse Management',
        loadComponent: () =>
          import('./features/warehouse/components/warehouse-detail/warehouse-detail').then(
            (m) => m.WarehouseDetail,
          ),
      },
      {
        path: 'customer',
        title: 'Customer Management',
        loadComponent: () =>
          import('./features/customer/components/customer-detail/customer-detail').then(
            (m) => m.CustomerDetail,
          ),
      },
      {
        path: 'purchase-order',
        title: 'Purchase Order Management',
        loadComponent: () =>
          import(
            './features/purchase-order/components/purchase-order-detail/purchase-order-detail'
          ).then((m) => m.PurchaseOrderDetail),
      },
      {
        path: 'sales-order',
        title: 'Sales Order Management',
        loadComponent: () =>
          import('./features/sales-order/components/sales-order-detail/sales-order-detail').then(
            (m) => m.SalesOrderDetail,
          ),
      },
      {
        path: 'inventory',
        title: 'Inventory Management',
        loadComponent: () =>
          import('./features/inventory/components/inventory-detail/inventory-detail').then(
            (m) => m.InventoryDetail,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.Notfound),
  },
];
