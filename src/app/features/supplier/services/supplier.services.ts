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

  createSupplier(supplier: SupplierRequest) {
    return this.api.post<SupplierRequest>('/suppliers', supplier);
  }

  updateSupplier(id: number, supplier: SupplierRequest) {
    return this.api.put<SupplierRequest>(`/suppliers/${id}`, supplier);
  }

  deleteSupplier(id: number) {
    return this.api.delete<void>(`/suppliers/${id}`);
  }
}
