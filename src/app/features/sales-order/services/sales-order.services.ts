import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { OrderRequest, OrderResponse } from '../models/sales-order.model';
import { PaginatedApiResponse, Meta } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private apiService = inject(ApiService);

  getAllSalesOrder(page: number, pageSize: number) {
    return this.apiService.get<PaginatedApiResponse<OrderResponse[], Meta>>(
      `/orders?page=${page}&pageSize=${pageSize}`,
    );
  }
  createSalesOrder(salesOrder: OrderRequest) {
    return this.apiService.post<OrderRequest>('/orders', salesOrder);
  }

  updateSalesOrder(id: number, salesOrder: OrderRequest) {
    return this.apiService.put<OrderRequest>(`/orders/${id}`, salesOrder);
  }
  deleteSalesOrder(id: number) {
    return this.apiService.delete(`/orders/${id}`);
  }
}
