import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Meta, PaginatedApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.service';
import { Product, ProductRequest, ProductUpdate } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api = inject(ApiService);

  getAllProducts(
    page?: number,
    pageSize?: number,
    search?: string,
    sortColumn?: string | string[] | null,
    sortDirection?: string
  ): Observable<PaginatedApiResponse<Product[], Meta>> {
    let params = new HttpParams();

    if (search?.trim()) params = params.set('search', search.trim());
    if (sortColumn) params = params.set('sortColumn', Array.isArray(sortColumn) ? sortColumn.join(',') : sortColumn);
    if (sortDirection) params = params.set('sortDirection', sortDirection);
    if (page != null) params = params.set('page', page.toString());
    if (pageSize != null) params = params.set('pageSize', pageSize.toString());

    return this.api.get<PaginatedApiResponse<Product[], Meta>>('/products', { params });
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
