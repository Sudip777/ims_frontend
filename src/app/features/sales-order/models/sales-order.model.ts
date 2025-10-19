export interface OrderResponse {
  orderId: number;
  orderDate: Date;
  totalAmount: number;
  customerId: number;
  customerName: string;
  statusId: number;
  statusName: string;
  createdByUserId: number;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  orderDetailId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  warehouseId: number;
  productName: string;
}

export type OrderRequest = Omit<
  OrderResponse,
  'orderId' | 'createdByUserId' | 'statusName' | 'totalAmount'
>;
