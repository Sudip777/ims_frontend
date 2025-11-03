import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.services';
import { PurchaseOrder, PurchaseOrderRequest } from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private apiService = inject(ApiService);
  getAllPurchaseOrders(
    page?: number,
    pageSize?: number,
    search?: string,
    sortColumn?: string | string[] | null,
    sortDirection?: string,
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

    return this.apiService.get<PaginatedApiResponse<PurchaseOrder[], Meta>>(`/purchaseorders`, {
      params,
    });
  }
  updatePurchaseOrder(id: number, purchaseOrder: PurchaseOrderRequest) {
    return this.apiService.put(`/purchaseorders/${id}`, purchaseOrder);
  }
  deletePurchaseOrder(id: number) {
    return this.apiService.delete(`/purchaseorders/${id}`);
  }
  createPurchaseOrder(purchaseOrder: PurchaseOrderRequest) {
    return this.apiService.post('/purchaseorders', purchaseOrder);
  }
}
