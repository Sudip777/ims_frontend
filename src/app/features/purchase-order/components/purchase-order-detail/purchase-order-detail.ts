import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PurchaseOrderTable } from '../purchase-order-table/purchase-order-table';
import { PurchaseOrderDialog } from '../purchase-order-dialog/purchase-order-dialog';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.services';
import { NotificationService } from '../../../../core/services/notification.services';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [
    CommonModule,
    PurchaseOrderTable,
    PurchaseOrderDialog,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './purchase-order-detail.html',
})
export class PurchaseOrderComponent {
  private purchaseOrderService = inject(PurchaseOrderService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  purchaseOrders: PurchaseOrder[] = [];
  purchaseOrder: PurchaseOrder = this.createEmptyPurchaseOrder();
  purchaseOrderDialog = false;
  expandedRows: { [key: number]: boolean } = {};
  purchaseOrderItems: any[] = [];
  totalCount = 0;
  pageSize = 10;
  page = 1;

  statusOptions = [
    { label: 'Pending', value: 1 },
    { label: 'Approved', value: 2 },
    { label: 'Received', value: 3 },
    { label: 'Cancelled', value: 4 },
  ];

  ngOnInit() {
    this.loadPurchaseOrderDetails();
  }

  private loadPurchaseOrderDetails(page = 1, pageSize = 100) {
    return this.purchaseOrderService.getAllPurchaseOrders(page, pageSize).subscribe({
      next: (res) => {
        this.purchaseOrders = res.result.data;
        this.totalCount = res.result.meta.totalCount;
        this.page = res.result.meta.page;
        this.pageSize = res.result.meta.pageSize;
        console.log(res.result.data, 'jhgjhghjghj');
      },
      error: (err) => {
        this.notificationService.error(
          'Error!!',
          `${err.error.message}` || 'Failed to Load Purchase Order Details'
        );
      },
    });
  }
  onRowExpand(purchaseOrder: PurchaseOrder) {
    this.expandedRows[purchaseOrder.purchaseOrderId] = true;
    this.expandedRows = { ...this.expandedRows };
    console.log(purchaseOrder, 'pppppp');
  }

  onRowCollapse(purchaseOrder: PurchaseOrder) {
    const { [purchaseOrder.purchaseOrderId]: _, ...rest } = this.expandedRows;
    this.expandedRows = rest;
    console.log(purchaseOrder, 'orderrrrr');
  }

  exportCSV() {
    this.notificationService.info('Export', 'Export to CSV Started');
  }

  createEmptyPurchaseOrder(): PurchaseOrder {
    return {
      purchaseOrderId: 0,
      supplierId: 0,
      supplierName: '',
      statusId: 1,
      statusName: 'Pending',
      totalAmount: 0,
      orderDate: new Date(),
      createdByUserId: 0,
      purchaseOrderDetails: [],
    };
  }

  openNew() {
    this.purchaseOrder = this.createEmptyPurchaseOrder();
    this.purchaseOrderDialog = true;
  }

  hideDialog() {
    this.purchaseOrderDialog = false;
  }

  savePurchaseOrder(purchaseOrder: PurchaseOrder) {
    if (purchaseOrder.supplierName.trim()) {
      if (purchaseOrder.purchaseOrderId) {
        const index = this.purchaseOrders.findIndex(
          (po) => po.purchaseOrderId === purchaseOrder.purchaseOrderId
        );
        if (index !== -1) {
          const status = this.statusOptions.find((s) => s.value === purchaseOrder.statusId);
          purchaseOrder.statusName = status?.label || 'Pending';
          this.purchaseOrders[index] = purchaseOrder;
        }
        this.notificationService.success('Successful', 'Purchase Order Updated', 3000);
      } else {
        purchaseOrder.purchaseOrderId = this.createId();
        const status = this.statusOptions.find((s) => s.value === purchaseOrder.statusId);
        purchaseOrder.statusName = status?.label || 'Pending';
        this.purchaseOrders.push(purchaseOrder);
        this.notificationService.success('Successful', 'Purchase Order Created', 3000);
      }

      this.purchaseOrders = [...this.purchaseOrders];
      this.purchaseOrderDialog = false;
    }
  }

  editPurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.purchaseOrder = JSON.parse(JSON.stringify(purchaseOrder));
    this.purchaseOrderDialog = true;
  }

  deletePurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Purchase Order #${purchaseOrder.purchaseOrderId}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.purchaseOrders = this.purchaseOrders.filter(
          (po) => po.purchaseOrderId !== purchaseOrder.purchaseOrderId
        );
        this.notificationService.success('Deleted', 'Purchase Order Deleted');
      },
    });
  }

  createId(): number {
    return Math.floor(Math.random() * 10000) + 1000;
  }
}
