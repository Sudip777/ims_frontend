export interface CustomerResponse {
  customerId: number;
  name: string;
  phone: number;
  address: string;
  isActive: boolean;
  createdAt: Date;
  createdByUserId: number;
}

export type CustomerRequest = Omit<
  CustomerResponse,
  'createdAt' | 'customerId' | 'createdByUserId'
>;
