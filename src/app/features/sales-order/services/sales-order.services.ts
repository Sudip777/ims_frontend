import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { OrderRequest, OrderResponse } from '../models/sales-order.model';
import { PaginatedApiResponse, Meta } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private apiService = inject(ApiService);

  getAllSalesOrder() {
    return this.apiService.get<PaginatedApiResponse<OrderResponse[], Meta>>('/orders');
  }
  createSalesOrder(salesOrder: OrderRequest) {
    return this.apiService.post<OrderRequest>('/orders', salesOrder);
  }

  updateSalesOrder(salesOrder: OrderRequest) {
    return this.apiService.put<OrderRequest>('/orders', salesOrder);
  }
  deleteSalesOrder(id: number) {
    return this.apiService.delete('/orders');
  }
}
