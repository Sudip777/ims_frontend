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
  createdAt: Date;
}
