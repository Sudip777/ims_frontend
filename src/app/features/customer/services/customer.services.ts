import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.service';
import { CustomerRequest, CustomerResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private api = inject(ApiService);

  getAllCustomers() {
    return this.api.get<ApiResponse<CustomerResponse[]>>('/customers');
  }

  getCustomerById(id: number) {
    return this.api.get<ApiResponse<CustomerResponse[]>>(`/customers/${id}`);
  }

  createCustomer(customer: CustomerRequest) {
    return this.api.post<CustomerResponse>('/customers', customer);
  }
  updateCustomer(customer: CustomerRequest, id: number) {
    return this.api.put<CustomerResponse>(`/customers/${id}`, customer);
  }
  deleteCustomer(id: number) {
    return this.api.delete<void>(`/customers/${id}`);
  }
}
