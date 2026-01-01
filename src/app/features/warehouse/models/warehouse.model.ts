interface WarehouseResponse {
  warehouseId: number;
  name: string;
  createdByUserId: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type WarehouseRequest = Omit<WarehouseResponse, 'warehouseId' | 'createdByUserId'>;
