import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { OrderRequest } from '../models/sales-order.model';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderDetail {
  private apiService = inject(ApiService);

  getAllSalesOrder() {
    return this.apiService.get('/orders');
  }
  createSalesOrder(salesOrder: OrderRequest) {
    return this.apiService.post('/orders', salesOrder);
  }

  updateSalesOrder(salesOrder: OrderRequest) {
    return this.apiService.put('/orders', salesOrder);
  }
  deleteSalesOrder(id: number) {
    return this.apiService.delete('/orders');
  }
}
