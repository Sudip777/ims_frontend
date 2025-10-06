import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/icons/components/icon.component';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    CommonModule,
    IconComponent,
    RouterModule,
    DrawerModule,
    ButtonModule,
    BadgeModule,
    OverlayBadgeModule,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  sidebarOpen = false;

  toggleSidebar(open: boolean) {
    this.sidebarOpen = open;
    console.log('Sidebar toggled:', this.sidebarOpen);
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onChildActivate(component: any) {
    // Subscribe to child component's sidebar toggle events
    if (component.sidebarToggle) {
      component.sidebarToggle.subscribe((open: boolean) => {
        this.toggleSidebar(open);
      });
    }
  }
}
