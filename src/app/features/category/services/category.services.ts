import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.services';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private api: ApiService) {}

  getAllCategories() {
    return this.api.get<ApiResponse<CategoryResponse[]>>('/categories');
  }

  getCategoryById(id: number) {
    return this.api.get<ApiResponse<CategoryResponse>>(`/categories/${id}`);
  }

  createCategory(category: CategoryResponse) {
    return this.api.post<CategoryResponse>('/categories', category);
  }

  updateCategory(category: CategoryResponse) {
    return this.api.put<CategoryResponse>(`/categories/${category.categoryId}`, category);
  }

  deleteCategory(id: number) {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
