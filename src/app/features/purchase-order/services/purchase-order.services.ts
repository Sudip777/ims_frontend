import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';
import { PurchaseOrder } from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private apiService = inject(ApiService);
  getAllPurchaseOrders(page = 1, pageSize = 100) {
    return this.apiService.get<PaginatedApiResponse<PurchaseOrder[], Meta>>(
      `/purchaseorders?page=${page}&pageSize=${pageSize}`
    );
  }
  updatePurchaseOrder(purchaseOrder: PurchaseOrder, id: number) {
    return this.apiService.put('/purchaseorders', purchaseOrder);
  }
  deletePurchaseOrder(id: number) {
    return this.apiService.delete('/purchaseorders');
  }
}
