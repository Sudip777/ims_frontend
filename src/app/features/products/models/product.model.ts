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

export type ProductRequest = Omit<Product, 'productId' | 'categoryName' | 'supplierName'>;

export type ProductUpdate = Omit<Product, 'categoryName' | 'supplierName' | 'productId'>; // put update so
