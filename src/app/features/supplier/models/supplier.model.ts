interface SupplierResponse {
  supplierId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  createdByUserId: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SupplierRequest = Omit<SupplierResponse, 'supplierId' | 'createdAt' | 'createdByUserId'>;
