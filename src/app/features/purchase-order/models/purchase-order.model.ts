export interface PurchaseOrder {
  purchaseOrderId: number;
  supplierId: number;
  supplierName: string;
  statusId: number;
  statusName: string;
  totalAmount: number;
  orderDate: Date | string;
  createdByUserId: number;
  purchaseOrderDetails: PurchaseOrderDetailType[];
}

export interface PurchaseOrderDetailType {
  purchaseOrderDetailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export type PurchaseOrderDetailRequest = Omit<PurchaseOrderDetailType, 'purchaseOrderDetailId'>;

export type PurchaseOrderRequest = Omit<
  PurchaseOrder,
  | 'purchaseOrderId'
  | 'supplierName'
  | 'statusName'
  | 'totalAmount'
  | 'purchaseOrderDetails'
  | 'orderDate'
  | 'createdByUserId'
> & { purchaseOrderDetails: PurchaseOrderDetailRequest[] };
