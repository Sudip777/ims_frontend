import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ApiService } from '../../../core/services/api.services';
import { CategoryRequest, CategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private api = inject(ApiService);

  getAllCategories() {
    return this.api.get<ApiResponse<CategoryResponse[]>>('/categories');
  }

  getCategoryById(id: number) {
    return this.api.get<ApiResponse<CategoryResponse>>(`/categories/${id}`);
  }

  createCategory(category: CategoryRequest) {
    return this.api.post<CategoryRequest>('/categories', category);
  }

  updateCategory(category: CategoryRequest, categoryId: number) {
    return this.api.put<CategoryRequest>(`/categories/${categoryId}`, category);
  }

  deleteCategory(id: number) {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
