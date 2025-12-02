import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.service';
import { OrderRequest, OrderResponse } from '../models/sales-order.model';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private apiService = inject(ApiService);

  getAllSalesOrder(
    page: number,
    pageSize: number,
    search?: string,
    sortColumn?: string | string[] | null,
    sortDirection?: 'asc' | 'desc'
  ) {
    let params = new HttpParams();

    if (search?.trim()) params = params.set('search', search.trim());
    if (sortColumn) params = params.set('sortColumn', Array.isArray(sortColumn) ? sortColumn.join(',') : sortColumn);
    if (sortDirection) params = params.set('sortDirection', sortDirection);
    if (page != null) params = params.set('page', page.toString());
    if (pageSize != null) params = params.set('pageSize', pageSize.toString());
    return this.apiService.get<PaginatedApiResponse<OrderResponse[], Meta>>(`/orders`, { params });
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
