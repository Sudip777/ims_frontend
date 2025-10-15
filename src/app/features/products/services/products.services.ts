import { Injectable } from '@angular/core';
import { Product, ProductRequest, ProductUpdate } from '../models/product.model';
import { ApiService } from '../../../core/services/api.services';
import { Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private api: ApiService) {}

  getAllProducts(page = 1, pageSize = 10) {
    return this.api.get<PaginatedApiResponse<Product[], Meta>>(
      `/products?page=${page}&pageSize=${pageSize}`
    );
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
