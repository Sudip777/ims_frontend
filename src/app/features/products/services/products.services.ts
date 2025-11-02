import { inject, Injectable } from '@angular/core';
import { Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.services';
import { Product, ProductRequest, ProductUpdate } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api = inject(ApiService);

  getAllProducts(page?: number, pageSize?: number) {
    const endpoint = page && pageSize ? `/products?page=${page}&pageSize=${pageSize}` : '/products';

    return this.api.get<PaginatedApiResponse<Product[], Meta>>(endpoint);
  }

  getProductById(id: number) {
    return this.api.get<Product>(`/products/${id}`);
  }

  createProduct(product: ProductRequest) {
    return this.api.post<ProductRequest>('/products', product);
  }

  updateProduct(id: number, product: ProductUpdate) {
    return this.api.put<Product>(`/products/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.api.delete<void>(`/products/${id}`);
  }
}
