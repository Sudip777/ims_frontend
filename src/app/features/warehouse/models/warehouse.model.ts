interface WarehouseResponse {
  warehouseId: number;
  name: string;
  createdByUserId: number;
}

type WarehouseRequest = Omit<WarehouseResponse, 'warehouseId' | 'createdByUserId'>;
