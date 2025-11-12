import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { LoadingService } from '../../core/services/loading';
import { IconComponent } from '../../shared/icons/components/icon.component';
import { Sidebar } from '../sidebar/components/sidebar-details/sidebar';
import { Loader } from "../../shared/components/Loader/loader";

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
    Loader
],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  sidebarOpen = false;
  private loader = inject(LoadingService);
  loading$ = this.loader.loading$;

  toggleSidebar(open: boolean) {
    this.sidebarOpen = open;
    console.log('Sidebar toggled:', this.sidebarOpen);
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onChildActivate(component: { sidebarToggle: { subscribe: (arg0: (open: boolean) => void) => void } }) {
    // Subscribe to child component's sidebar toggle events
    if (component.sidebarToggle) {
      component.sidebarToggle.subscribe((open: boolean) => {
        this.toggleSidebar(open);
      });
    }
  }
}
