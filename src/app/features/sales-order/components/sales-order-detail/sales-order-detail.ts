import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { ApiService } from '../../../../core/services/api.services';
import { NotificationService } from '../../../../core/services/notification.services';
import { CustomerService } from '../../../customer/services/customer.services';
import { WarehouseService } from '../../../warehouse/services/warehouse.services';
import { SalesOrderService } from '../../services/sales-order.services';
import { ProductsService } from '../../../products/services/products.services';

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
    ReactiveFormsModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './sales-order-detail.html',
  styleUrls: ['./sales-order-detail.scss'],
})
export class SalesOrderDetail {
  private order = inject(SalesOrderService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);
  private customer = inject(CustomerService);
  private warehouse = inject(WarehouseService);
  private product = inject(ProductsService);

  salesOrderForm: FormGroup;

  orders: Order[] = [];
  orderDialog = false;
  submitted = false;
  expandedRows: { [key: number]: boolean } = {};
  items: any[] = [];
  totalCount = 0;
  pageSize = 10;
  page = 1;

  statusOptions = [
    { label: 'Pending', value: 1 },
    { label: 'Processing', value: 2 },
    { label: 'Completed', value: 3 },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.salesOrderForm = this.createOrderForm();
  }

  createOrderForm(): FormGroup {
    return this.fb.group({
      orderId: [0],
      customerName: ['', Validators.required],
      orderDate: [new Date(), Validators.required],
      statusId: [1, Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      orderDetails: this.fb.array([], Validators.required),
    });
  }

  get orderDetails(): FormArray {
    return this.salesOrderForm.get('orderDetails') as FormArray;
  }

  createOrderDetailFormGroup(detail?: OrderDetail): FormGroup {
    return this.fb.group({
      orderDetailId: [detail?.orderDetailId || Math.floor(Math.random() * 10000)],
      productId: [detail?.productId || 0],
      productName: [detail?.productName || '', Validators.required],
      warehouseId: [detail?.warehouseId || 0, Validators.required],
      quantity: [detail?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [detail?.unitPrice || 0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadOrderDetails();
  }

  private loadOrderDetails() {
    this.order.getAllSalesOrder().subscribe({
      next: (res) => {
        this.items = res.result.data;
        this.totalCount = res.result.meta.totalCount;
        this.page = res.result.meta.page;
        this.pageSize = res.result.meta.pageSize;
        console.log(res.result.data);
      },
      error: (err) => {
        this.notification.error('Error!!', `${err.message}` || 'Failed to Load Order Details');
      },
    });
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
    this.orders = [...this.orders];
  }

  onRowExpand(event: { data: Order }) {
    if (event.data) {
      this.expandedRows[event.data.orderId] = true;
      this.expandedRows = { ...this.expandedRows };
      this.orders = [...this.orders];
    }
  }

  onRowCollapse(event: { data: Order }) {
    if (event.data) {
      const { [event.data.orderId]: _, ...rest } = this.expandedRows;
      this.expandedRows = rest;
      this.orders = [...this.orders];
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

  openNew() {
    this.salesOrderForm.reset({
      orderId: 0,
      customerName: '',
      orderDate: new Date(),
      statusId: 1,
      totalAmount: 0,
    });
    this.orderDetails.clear();
    this.submitted = false;
    this.orderDialog = true;
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
  }

  addOrderDetail() {
    this.orderDetails.push(this.createOrderDetailFormGroup());
  }

  removeOrderDetail(index: number) {
    this.orderDetails.removeAt(index);
  }

  saveOrder() {
    this.submitted = true;

    if (this.salesOrderForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields and add at least one order item',
        life: 3000,
      });
      return;
    }

    const formValue = this.salesOrderForm.value;
    const orderId = formValue.orderId;

    const statusOption = this.statusOptions.find((s) => s.value === formValue.statusId);

    const order: Order = {
      orderId: orderId || this.createId(),
      orderDate: formValue.orderDate,
      customerName: formValue.customerName,
      customerId: 0,
      statusId: formValue.statusId,
      statusName: statusOption?.label || 'Pending',
      totalAmount: formValue.totalAmount,
      createdByUserId: 10,
      orderDetails: formValue.orderDetails,
    };

    if (orderId) {
      const index = this.orders.findIndex((o) => o.orderId === orderId);
      if (index !== -1) {
        this.orders[index] = order;
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Order Updated',
        life: 3000,
      });
    } else {
      this.orders.push(order);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Order Created',
        life: 3000,
      });
    }

    this.orders = [...this.orders];
    this.orderDialog = false;
  }

  editOrder(order: Order) {
    this.salesOrderForm.patchValue({
      orderId: order.orderId,
      customerName: order.customerName,
      orderDate: new Date(order.orderDate),
      statusId: order.statusId,
      totalAmount: order.totalAmount,
    });

    this.orderDetails.clear();
    order.orderDetails.forEach((detail) => {
      this.orderDetails.push(this.createOrderDetailFormGroup(detail));
    });

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
