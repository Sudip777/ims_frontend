export interface Product {
  productId: number;
  name: string;
  sku: string;
  unitPrice: number;
  costPrice: number;
  supplierId: number;
  supplierName?: null;
  categoryId: number;
  categoryName: string;
  reorderLevel: number;
  minStock: number;
  maxStock: number;
  isActive: boolean;
}

export interface ProductRequest
  extends Omit<Product, 'productId' | 'categoryName' | 'supplierName'> {}

export interface ProductUpdate
  extends Omit<Product, 'categoryName' | 'supplierName' | 'productId'> {}
