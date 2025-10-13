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
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.scss'],
})
export class SalesOrderDetail {
  orders: Order[] = [];
  order: Order = this.createEmptyOrder();
  orderDialog = false;
  submitted = false;

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
    ];
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

  exportCSV() {
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export CSV started...',
      life: 3000,
    });
  }
}
