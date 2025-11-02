export interface InventoryResponse {
  inventoryId: number;
  productId: number;
  productName?: string | null;
  warehouseId: number;
  warehouseName?: string | null;
  quantity: number;
  reorderLevel: number;
  createdbyUserId: number;
}

export type InventoryRequest = Pick<InventoryResponse, 'productId' | 'warehouseId' | 'quantity'>;
