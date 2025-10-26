import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IconComponent } from '../../../../shared/icons/components/icon.component';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ApiService } from '../../../../core/services/api.services';
import { SidebarService } from '../../services/sidebar.services';
import { NotificationService } from '../../../../core/services/notification.services';

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
    AvatarModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private sidebarService = inject(SidebarService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  @Input() sidebarOpen = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();

  sidebarMenuItems: any[] = [];

  private loadUserMenuItems() {
    this.sidebarService.getAllUserMenuItems().subscribe({
      next: (res) => {
        this.sidebarMenuItems = res.result;
      },
      error: () => {
        this.notificationService.error('Error!!', 'Failed to Load User Menu Items');
      },
    });
  }

  onNavigate() {
    // Close sidebar on mobile after navigation
    console.log('Navigation clicked, closing sidebar');
    this.closeSidebarEvent.emit();
  }
  ngOnInit(): void {
    this.loadUserMenuItems();
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
