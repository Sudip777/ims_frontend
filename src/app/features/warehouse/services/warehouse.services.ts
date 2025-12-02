import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private api = inject(ApiService);

  getAllWarehouses() {
    return this.api.get<ApiResponse<WarehouseResponse[]>>('/warehouses');
  }

  getWarehouseById(id: number) {
    return this.api.get<ApiResponse<SupplierResponse>>(`/warehouses/${id}`);
  }

  createWarehouse(warehouse: WarehouseRequest) {
    return this.api.post('/warehouses', warehouse);
  }

  updateWarehouse(warehouse: WarehouseRequest, id: number) {
    return this.api.put(`/warehouses/${id}`, warehouse);
  }

  deleteWarehouse(id: number) {
    return this.api.delete(`/warehouses/${id}`);
  }
}
