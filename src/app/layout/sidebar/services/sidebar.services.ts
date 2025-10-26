import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { ApiResponse } from '../../../core/models/api-response.model';
import { SidebarMenuItems } from '../models/sidebar.models';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  apiService = inject(ApiService);

  getAllUserMenuItems() {
    return this.apiService.get<ApiResponse<SidebarMenuItems[]>>('/user-menu');
  }
}
