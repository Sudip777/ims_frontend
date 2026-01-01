export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number | null;
  parentCategory: string | 'N/A';
}

export type CategoryRequest = Omit<CategoryResponse, 'categoryId' | 'parentCategory'>;
