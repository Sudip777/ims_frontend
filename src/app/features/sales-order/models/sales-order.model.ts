export interface OrderResponse {
  orderId: number;
  orderDate: Date;
  totalAmount: number;
  customerId: number | null;
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
export type OrderDetailRequest = Omit<OrderDetail, 'orderDetailId' | 'productName'>;
export interface OrderRequest
  extends Omit<
    OrderResponse,
    'createdByUserId' | 'statusName' | 'totalAmount' | 'customerName' | 'orderDate' | 'orderDetails'
  > {
  orderDetails: OrderDetailRequest[];
}
