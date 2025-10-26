import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { ApiResponse } from '../../../core/models/api-response.model';
import { UserDetail } from '../../../core/models/user-detail.model';
import { SidebarMenuItems } from '../models/sidebar.models';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  apiService = inject(ApiService);

  userDetails = signal<any>(null);

  getAllUserMenuItems() {
    return this.apiService.get<ApiResponse<SidebarMenuItems[]>>('/user-menu');
  }
  getAllUserDetails() {
    return this.apiService.get<ApiResponse<UserDetail[]>>('/auth/user');
  }
}
