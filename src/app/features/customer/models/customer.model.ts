interface CustomerResponse {
  customerId: number;
  name: string;
  phone: number;
  address: string;
  isActive: boolean;
  createdAt: Date;
  createdByUserId: number;
}

type CustomerRequest = Omit<CustomerResponse, 'createdAt' | 'customerId' | 'createdByUserId'>;
