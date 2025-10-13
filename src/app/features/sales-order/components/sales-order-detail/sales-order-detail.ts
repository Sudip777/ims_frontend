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

interface OrderDetail {
  orderDetailId: number;
  productId: number;
  productName: string;
  warehouseId: number;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderId: number;
  orderDate: Date | string;
  customerName: string;
  customerId: number;
  statusId: number;
  statusName: string;
  totalAmount: number;
  createdByUserId: number;
  orderDetails: OrderDetail[];
}

@Component({
  selector: 'app-order-detail',
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
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './sales-order-detail.html',
  styleUrls: ['./sales-order-detail.scss'],
})
export class SalesOrderDetail {
  orders: Order[] = [];
  order: Order = this.createEmptyOrder();
  orderDialog = false;
  submitted = false;
  expandedRows: { [key: number]: boolean } = {};

  statusOptions = [
    { label: 'Pending', value: 1 },
    { label: 'Processing', value: 2 },
    { label: 'Completed', value: 3 },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Mock Data
    this.orders = [
      {
        orderId: 1,
        orderDate: new Date('2025-10-01'),
        customerName: 'John Doe',
        customerId: 101,
        statusId: 1,
        statusName: 'Pending',
        totalAmount: 500,
        createdByUserId: 10,
        orderDetails: [
          {
            orderDetailId: 1,
            productId: 1,
            productName: 'Laptop',
            warehouseId: 101,
            quantity: 1,
            unitPrice: 400,
          },
          {
            orderDetailId: 2,
            productId: 2,
            productName: 'Mouse',
            warehouseId: 101,
            quantity: 2,
            unitPrice: 50,
          },
        ],
      },
      {
        orderId: 2,
        orderDate: new Date('2025-10-02'),
        customerName: 'Jane Smith',
        customerId: 102,
        statusId: 2,
        statusName: 'Shipped',
        totalAmount: 1200,
        createdByUserId: 11,
        orderDetails: [
          {
            orderDetailId: 3,
            productId: 3,
            productName: 'Smartphone',
            warehouseId: 102,
            quantity: 2,
            unitPrice: 600,
          },
        ],
      },
      {
        orderId: 3,
        orderDate: new Date('2025-10-03'),
        customerName: 'Michael Johnson',
        customerId: 103,
        statusId: 3,
        statusName: 'Delivered',
        totalAmount: 750,
        createdByUserId: 12,
        orderDetails: [
          {
            orderDetailId: 4,
            productId: 4,
            productName: 'Tablet',
            warehouseId: 103,
            quantity: 1,
            unitPrice: 700,
          },
          {
            orderDetailId: 5,
            productId: 5,
            productName: 'Stylus Pen',
            warehouseId: 103,
            quantity: 1,
            unitPrice: 50,
          },
        ],
      },
      {
        orderId: 4,
        orderDate: new Date('2025-10-04'),
        customerName: 'Emily Davis',
        customerId: 104,
        statusId: 1,
        statusName: 'Pending',
        totalAmount: 300,
        createdByUserId: 10,
        orderDetails: [
          {
            orderDetailId: 6,
            productId: 6,
            productName: 'Headphones',
            warehouseId: 104,
            quantity: 2,
            unitPrice: 150,
          },
        ],
      },
      {
        orderId: 5,
        orderDate: new Date('2025-10-05'),
        customerName: 'Chris Lee',
        customerId: 105,
        statusId: 2,
        statusName: 'Shipped',
        totalAmount: 950,
        createdByUserId: 13,
        orderDetails: [
          {
            orderDetailId: 7,
            productId: 7,
            productName: 'Gaming Keyboard',
            warehouseId: 105,
            quantity: 1,
            unitPrice: 150,
          },
          {
            orderDetailId: 8,
            productId: 8,
            productName: 'Monitor',
            warehouseId: 105,
            quantity: 1,
            unitPrice: 800,
          },
        ],
      },
      {
        orderId: 6,
        orderDate: new Date('2025-10-06'),
        customerName: 'Sarah Wilson',
        customerId: 106,
        statusId: 3,
        statusName: 'Delivered',
        totalAmount: 1800,
        createdByUserId: 12,
        orderDetails: [
          {
            orderDetailId: 9,
            productId: 9,
            productName: 'Desktop PC',
            warehouseId: 106,
            quantity: 1,
            unitPrice: 1800,
          },
        ],
      },
      {
        orderId: 7,
        orderDate: new Date('2025-10-07'),
        customerName: 'David Brown',
        customerId: 107,
        statusId: 4,
        statusName: 'Cancelled',
        totalAmount: 400,
        createdByUserId: 14,
        orderDetails: [
          {
            orderDetailId: 10,
            productId: 10,
            productName: 'External Hard Drive',
            warehouseId: 107,
            quantity: 2,
            unitPrice: 200,
          },
        ],
      },
      {
        orderId: 8,
        orderDate: new Date('2025-10-08'),
        customerName: 'Linda Martinez',
        customerId: 108,
        statusId: 1,
        statusName: 'Pending',
        totalAmount: 850,
        createdByUserId: 10,
        orderDetails: [
          {
            orderDetailId: 11,
            productId: 11,
            productName: 'Printer',
            warehouseId: 108,
            quantity: 1,
            unitPrice: 850,
          },
        ],
      },
      {
        orderId: 9,
        orderDate: new Date('2025-10-09'),
        customerName: 'Robert Taylor',
        customerId: 109,
        statusId: 2,
        statusName: 'Shipped',
        totalAmount: 600,
        createdByUserId: 13,
        orderDetails: [
          {
            orderDetailId: 12,
            productId: 12,
            productName: 'Router',
            warehouseId: 109,
            quantity: 2,
            unitPrice: 300,
          },
        ],
      },
      {
        orderId: 10,
        orderDate: new Date('2025-10-10'),
        customerName: 'Patricia Anderson',
        customerId: 110,
        statusId: 3,
        statusName: 'Delivered',
        totalAmount: 1050,
        createdByUserId: 11,
        orderDetails: [
          {
            orderDetailId: 13,
            productId: 13,
            productName: 'Camera',
            warehouseId: 110,
            quantity: 1,
            unitPrice: 950,
          },
          {
            orderDetailId: 14,
            productId: 14,
            productName: 'Memory Card',
            warehouseId: 110,
            quantity: 1,
            unitPrice: 100,
          },
        ],
      },
      {
        orderId: 11,
        orderDate: new Date('2025-10-11'),
        customerName: 'Kevin White',
        customerId: 111,
        statusId: 2,
        statusName: 'Shipped',
        totalAmount: 2200,
        createdByUserId: 15,
        orderDetails: [
          {
            orderDetailId: 15,
            productId: 15,
            productName: 'Projector',
            warehouseId: 111,
            quantity: 1,
            unitPrice: 2200,
          },
        ],
      },
    ];
  }

  toggleAll(expand: boolean) {
    if (expand) {
      this.expandedRows = this.orders.reduce((acc, o) => {
        acc[o.orderId] = true;
        return acc;
      }, {} as { [key: number]: boolean });
    } else {
      this.expandedRows = {};
    }
    // Force change detection by updating the array reference
    this.orders = [...this.orders];
  }

  onRowExpand(event: { data: Order }) {
    if (event.data) {
      this.expandedRows[event.data.orderId] = true;
      this.expandedRows = { ...this.expandedRows }; // Ensure new object reference
      this.orders = [...this.orders]; // Trigger change detection
    }
  }

  onRowCollapse(event: { data: Order }) {
    if (event.data) {
      const { [event.data.orderId]: _, ...rest } = this.expandedRows;
      this.expandedRows = rest;
      this.orders = [...this.orders]; // Trigger change detection
    }
  }

  /**
   * Trigger a CSV export of the current sales orders data.
   * For now, this just shows a message saying that the export
   * has started, but in the future, this will actually
   * generate a CSV file.
   */
  exportCSV() {
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export to CSV started...',
      life: 3000,
    });
    // Optionally, implement export logic here later
  }

  createEmptyOrder(): Order {
    return {
      orderId: 0,
      orderDate: new Date(),
      customerName: '',
      customerId: 0,
      statusId: 1,
      statusName: 'Pending',
      totalAmount: 0,
      createdByUserId: 0,
      orderDetails: [],
    };
  }

  openNew() {
    this.order = this.createEmptyOrder();
    this.submitted = false;
    this.orderDialog = true;
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
  }

  addOrderDetail() {
    this.order.orderDetails.push({
      orderDetailId: Math.floor(Math.random() * 10000),
      productId: 0,
      productName: '',
      warehouseId: 0,
      quantity: 1,
      unitPrice: 0,
    });
  }

  removeOrderDetail(index: number) {
    this.order.orderDetails.splice(index, 1);
  }

  saveOrder() {
    this.submitted = true;

    if (this.order.customerName.trim()) {
      if (this.order.orderId) {
        const index = this.orders.findIndex((o) => o.orderId === this.order.orderId);
        if (index !== -1) this.orders[index] = this.order;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Order Updated',
          life: 3000,
        });
      } else {
        this.order.orderId = this.createId();
        this.orders.push(this.order);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Order Created',
          life: 3000,
        });
      }

      this.orders = [...this.orders];
      this.orderDialog = false;
      this.order = this.createEmptyOrder();
    }
  }

  editOrder(order: Order) {
    this.order = JSON.parse(JSON.stringify(order));
    this.orderDialog = true;
  }

  deleteOrder(order: Order) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order #${order.orderId}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orders = this.orders.filter((o) => o.orderId !== order.orderId);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Order Deleted',
          life: 3000,
        });
      },
    });
  }

  createId(): number {
    return Math.floor(Math.random() * 10000) + 1000;
  }
}
