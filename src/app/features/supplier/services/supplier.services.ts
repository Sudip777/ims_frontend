import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private api = inject(ApiService);

  getAllSuppliers() {
    return this.api.get<ApiResponse<SupplierResponse[]>>('/suppliers');
  }

  getSupplierById(id: number) {
    return this.api.get<SupplierResponse>(`/suppliers/${id}`);
  }

  createSupplier(supplier: SupplierResponse) {
    return this.api.post<SupplierResponse>('/suppliers', supplier);
  }

  updateSupplier(supplier: SupplierResponse) {
    return this.api.put<SupplierResponse>(`/suppliers/${supplier.supplierId}`, supplier);
  }

  deleteSupplier(id: number) {
    return this.api.delete<void>(`/suppliers/${id}`);
  }
}
