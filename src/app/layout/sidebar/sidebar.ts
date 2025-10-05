import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../shared/icons/components/icon.component';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    IconComponent,
    IconField,
    InputIconModule,
    InputIconModule,
    CommonModule,
    FormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    DatePickerModule,
    ChartModule,
    ButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() sidebarOpen = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();

  navItems: NavItem[] = [
    { icon: 'dashboard-overview', label: 'Overview', route: '/dashboard/overview' },
    { icon: 'product', label: 'Product', route: '/dashboard/product' },
    { icon: 'supplier', label: 'Supplier', route: '/dashboard/supplier' },
    { icon: 'shipment', label: 'Shipment', route: '/dashboard/shipment' },
    { icon: 'category', label: 'Category', route: '/dashboard/category' },
    { icon: 'dashboard-warehouse', label: 'Warehouse', route: '/dashboard/warehouse' },
    { icon: 'stock', label: 'Stock', route: '/dashboard/stock' },
    { icon: 'purchase-order', label: 'Purchase Order', route: '/dashboard/purchase-order' },
    { icon: 'sales-order', label: 'Sales Order', route: '/dashboard/sales-order' },
    { icon: 'customer', label: 'Customer', route: '/dashboard/customer' },
  ];

  constructor(private router: Router) {}

  onNavigate() {
    // Close sidebar on mobile after navigation
    console.log('Navigation clicked, closing sidebar');
    this.closeSidebarEvent.emit();
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
