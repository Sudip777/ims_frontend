import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { ApiResponse, Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly apiService = inject(ApiService);

  getAllInventories() {
    return this.apiService.get<PaginatedApiResponse<InventoryResponse[], Meta>>('/inventories');
  }
  getInventoryById(id: number) {
    return this.apiService.get(`inventories/${id}`);
  }
  createInventory(inventory: InventoryRequest) {
    return this.apiService.post('/inventories', inventory);
  }

  updateInventory(inventory: InventoryRequest, id: number) {
    return this.apiService.put(`/inventories/${id}`, inventory);
  }
}
