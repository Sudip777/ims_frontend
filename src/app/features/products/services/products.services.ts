import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { ApiService } from '../../../core/services/api';
import { ApiResponse, Meta } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private api: ApiService) {}

  getAllProducts() {
    return this.api.get<ApiResponse<Product[], Meta>>('/products');
  }

  getProductById(id: number) {
    return this.api.get<Product>(`/products/${id}`);
  }

  createProduct(product: Product) {
    return this.api.post<Product>('/products', product);
  }

  updateProduct(product: Product) {
    return this.api.put<Product>(`/products/${product.productId}`, product);
  }

  deleteProduct(id: number) {
    return this.api.delete<void>(`/products/${id}`);
  }
}
