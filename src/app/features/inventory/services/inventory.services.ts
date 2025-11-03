import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.services';
import { InventoryRequest, InventoryResponse } from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly apiService = inject(ApiService);

  getAllInventories(
    page?: number,
    pageSize?: number,
    search?: string,
    sortColumn?: string | string[] | null,
    sortDirection?: 'asc' | 'desc',
  ) {
    let params = new HttpParams();

    if (search?.trim()) params = params.set('search', search.trim());
    if (sortColumn)
      params = params.set(
        'sortColumn',
        Array.isArray(sortColumn) ? sortColumn.join(',') : sortColumn,
      );
    if (sortDirection) params = params.set('sortDirection', sortDirection);
    if (page != null) params = params.set('page', page.toString());
    if (pageSize != null) params = params.set('pageSize', pageSize.toString());
    return this.apiService.get<PaginatedApiResponse<InventoryResponse[], Meta>>('/inventories', {
      params,
    });
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
