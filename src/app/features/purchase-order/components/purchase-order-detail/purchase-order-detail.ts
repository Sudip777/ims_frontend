import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface PurchaseOrderDetail {
  purchaseOrderDetailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface PurchaseOrder {
  purchaseOrderId: number;
  supplierId: number;
  supplierName: string;
  statusId: number;
  statusName: string;
  totalAmount: number;
  orderDate: Date | string;
  createdByUserId: number;
  purchaseOrderDetails: PurchaseOrderDetail[];
}

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
    TableModule,
    ToggleSwitchModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './purchase-order-detail.html',
  styleUrls: ['./purchase-order-detail.scss'],
})
export class PurchaseOrderComponent {
  purchaseOrders: PurchaseOrder[] = [];
  purchaseOrder: PurchaseOrder = this.createEmptyPurchaseOrder();
  purchaseOrderDialog = false;
  submitted = false;
  expandedRows: { [key: number]: boolean } = {};
  checked: boolean = true;

  statusOptions = [
    { label: 'Pending', value: 1 },
    { label: 'Approved', value: 2 },
    { label: 'Received', value: 3 },
    { label: 'Cancelled', value: 4 },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Mock Data - 11 Purchase Orders
    this.purchaseOrders = [
      {
        purchaseOrderId: 1,
        supplierId: 201,
        supplierName: 'Tech Supplies Inc.',
        statusId: 1,
        statusName: 'Pending',
        totalAmount: 5000,
        orderDate: new Date('2025-10-01'),
        createdByUserId: 10,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 1,
            productId: 1001,
            productName: 'Laptop Dell XPS',
            quantity: 5,
            unitPrice: 1000,
          },
        ],
      },
      {
        purchaseOrderId: 2,
        supplierId: 202,
        supplierName: 'Office Depot',
        statusId: 2,
        statusName: 'Approved',
        totalAmount: 3200,
        orderDate: new Date('2025-10-02'),
        createdByUserId: 11,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 2,
            productId: 1002,
            productName: 'Office Desk',
            quantity: 10,
            unitPrice: 250,
          },
          {
            purchaseOrderDetailId: 3,
            productId: 1003,
            productName: 'Office Chair',
            quantity: 10,
            unitPrice: 70,
          },
        ],
      },
      {
        purchaseOrderId: 3,
        supplierId: 203,
        supplierName: 'Electronics Hub',
        statusId: 3,
        statusName: 'Received',
        totalAmount: 12000,
        orderDate: new Date('2025-10-03'),
        createdByUserId: 12,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 4,
            productId: 1004,
            productName: 'LED Monitor 27"',
            quantity: 20,
            unitPrice: 350,
          },
          {
            purchaseOrderDetailId: 5,
            productId: 1005,
            productName: 'Wireless Keyboard',
            quantity: 50,
            unitPrice: 45,
          },
          {
            purchaseOrderDetailId: 6,
            productId: 1006,
            productName: 'Wireless Mouse',
            quantity: 50,
            unitPrice: 25,
          },
        ],
      },
      {
        purchaseOrderId: 4,
        supplierId: 204,
        supplierName: 'Furniture World',
        statusId: 1,
        statusName: 'Pending',
        totalAmount: 8500,
        orderDate: new Date('2025-10-04'),
        createdByUserId: 10,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 7,
            productId: 1007,
            productName: 'Conference Table',
            quantity: 5,
            unitPrice: 1200,
          },
          {
            purchaseOrderDetailId: 8,
            productId: 1008,
            productName: 'Meeting Chairs',
            quantity: 25,
            unitPrice: 100,
          },
        ],
      },
      {
        purchaseOrderId: 5,
        supplierId: 205,
        supplierName: 'Computer Parts Ltd.',
        statusId: 2,
        statusName: 'Approved',
        totalAmount: 15000,
        orderDate: new Date('2025-10-05'),
        createdByUserId: 13,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 9,
            productId: 1009,
            productName: 'Server Rack',
            quantity: 3,
            unitPrice: 4000,
          },
          {
            purchaseOrderDetailId: 10,
            productId: 1010,
            productName: 'Network Switch',
            quantity: 10,
            unitPrice: 300,
          },
        ],
      },
      {
        purchaseOrderId: 6,
        supplierId: 206,
        supplierName: 'Print Solutions',
        statusId: 3,
        statusName: 'Received',
        totalAmount: 4500,
        orderDate: new Date('2025-10-06'),
        createdByUserId: 12,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 11,
            productId: 1011,
            productName: 'Laser Printer',
            quantity: 5,
            unitPrice: 800,
          },
          {
            purchaseOrderDetailId: 12,
            productId: 1012,
            productName: 'Printer Toner',
            quantity: 25,
            unitPrice: 20,
          },
        ],
      },
      {
        purchaseOrderId: 7,
        supplierId: 207,
        supplierName: 'Mobile Tech Distributors',
        statusId: 4,
        statusName: 'Cancelled',
        totalAmount: 18000,
        orderDate: new Date('2025-10-07'),
        createdByUserId: 14,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 13,
            productId: 1013,
            productName: 'iPhone 15 Pro',
            quantity: 20,
            unitPrice: 900,
          },
        ],
      },
      {
        purchaseOrderId: 8,
        supplierId: 208,
        supplierName: 'Storage Solutions',
        statusId: 1,
        statusName: 'Pending',
        totalAmount: 6000,
        orderDate: new Date('2025-10-08'),
        createdByUserId: 10,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 14,
            productId: 1014,
            productName: 'SSD 1TB',
            quantity: 30,
            unitPrice: 150,
          },
          {
            purchaseOrderDetailId: 15,
            productId: 1015,
            productName: 'External HDD 4TB',
            quantity: 15,
            unitPrice: 100,
          },
        ],
      },
      {
        purchaseOrderId: 9,
        supplierId: 209,
        supplierName: 'Network Equipment Co.',
        statusId: 2,
        statusName: 'Approved',
        totalAmount: 9500,
        orderDate: new Date('2025-10-09'),
        createdByUserId: 13,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 16,
            productId: 1016,
            productName: 'WiFi Router Enterprise',
            quantity: 10,
            unitPrice: 450,
          },
          {
            purchaseOrderDetailId: 17,
            productId: 1017,
            productName: 'Ethernet Cables 100m',
            quantity: 100,
            unitPrice: 50,
          },
        ],
      },
      {
        purchaseOrderId: 10,
        supplierId: 210,
        supplierName: 'Security Systems Inc.',
        statusId: 3,
        statusName: 'Received',
        totalAmount: 22000,
        orderDate: new Date('2025-10-10'),
        createdByUserId: 11,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 18,
            productId: 1018,
            productName: 'Security Camera 4K',
            quantity: 40,
            unitPrice: 500,
          },
          {
            purchaseOrderDetailId: 19,
            productId: 1019,
            productName: 'DVR System',
            quantity: 4,
            unitPrice: 500,
          },
        ],
      },
      {
        purchaseOrderId: 11,
        supplierId: 211,
        supplierName: 'Software Licensing Corp.',
        statusId: 2,
        statusName: 'Approved',
        totalAmount: 50000,
        orderDate: new Date('2025-10-11'),
        createdByUserId: 15,
        purchaseOrderDetails: [
          {
            purchaseOrderDetailId: 20,
            productId: 1020,
            productName: 'Microsoft Office 365',
            quantity: 100,
            unitPrice: 150,
          },
          {
            purchaseOrderDetailId: 21,
            productId: 1021,
            productName: 'Adobe Creative Cloud',
            quantity: 50,
            unitPrice: 550,
          },
        ],
      },
    ];
  }

  toggleAll(expand: boolean) {
    if (expand) {
      this.expandedRows = this.purchaseOrders.reduce((acc, po) => {
        acc[po.purchaseOrderId] = true;
        return acc;
      }, {} as { [key: number]: boolean });
    } else {
      this.expandedRows = {};
    }
    this.purchaseOrders = [...this.purchaseOrders];
  }

  onRowExpand(event: { data: PurchaseOrder }) {
    if (event.data) {
      this.expandedRows[event.data.purchaseOrderId] = true;
      this.expandedRows = { ...this.expandedRows };
      this.purchaseOrders = [...this.purchaseOrders];
    }
  }

  onRowCollapse(event: { data: PurchaseOrder }) {
    if (event.data) {
      const { [event.data.purchaseOrderId]: _, ...rest } = this.expandedRows;
      this.expandedRows = rest;
      this.purchaseOrders = [...this.purchaseOrders];
    }
  }

  exportCSV() {
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export to CSV started...',
      life: 3000,
    });
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
    this.submitted = false;
    this.purchaseOrderDialog = true;
  }

  hideDialog() {
    this.purchaseOrderDialog = false;
    this.submitted = false;
  }

  addPurchaseOrderDetail() {
    this.purchaseOrder.purchaseOrderDetails.push({
      purchaseOrderDetailId: Math.floor(Math.random() * 10000),
      productId: 0,
      productName: '',
      quantity: 1,
      unitPrice: 0,
    });
  }

  removePurchaseOrderDetail(index: number) {
    this.purchaseOrder.purchaseOrderDetails.splice(index, 1);
  }

  savePurchaseOrder() {
    this.submitted = true;

    if (this.purchaseOrder.supplierName.trim()) {
      if (this.purchaseOrder.purchaseOrderId) {
        const index = this.purchaseOrders.findIndex(
          (po) => po.purchaseOrderId === this.purchaseOrder.purchaseOrderId
        );
        if (index !== -1) this.purchaseOrders[index] = this.purchaseOrder;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Purchase Order Updated',
          life: 3000,
        });
      } else {
        this.purchaseOrder.purchaseOrderId = this.createId();
        this.purchaseOrders.push(this.purchaseOrder);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Purchase Order Created',
          life: 3000,
        });
      }

      this.purchaseOrders = [...this.purchaseOrders];
      this.purchaseOrderDialog = false;
      this.purchaseOrder = this.createEmptyPurchaseOrder();
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
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Purchase Order Deleted',
          life: 3000,
        });
      },
    });
  }

  createId(): number {
    return Math.floor(Math.random() * 10000) + 1000;
  }
}
