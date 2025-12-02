import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthStore } from '../../../../core/store/auth-store';
import { IconComponent } from '../../../../shared/icons/components/icon.component';
import { SidebarService } from '../../services/sidebar.services';
interface SidebarMenuItem {
  route: string;
  icon: string;
  label: string;
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
export class Sidebar implements OnInit {
  private sidebarService = inject(SidebarService);
  private authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  @Input() sidebarOpen = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();
  apiService = inject(ApiService);

  userDetails = signal<unknown>(null);

  userDetailItems: unknown = '';
  roleName = this.authStore.userRole;
  userName = this.authStore.username;
  sidebarMenuItems: SidebarMenuItem[] = [];

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
  private loadUserProfile() {
    this.sidebarService.getAllUserDetails().subscribe({
      next: (res) => {
        this.userDetailItems = res.result;
        console.log(this.userDetailItems, 'dataaaaa');
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
    this.loadUserProfile();
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
