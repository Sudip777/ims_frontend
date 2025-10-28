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
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
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

import { ExportService } from '../../../../core/services/export.services';
import { NotificationService } from '../../../../core/services/notification.services';
import { CustomerService } from '../../../customer/services/customer.services';
import { ProductsService } from '../../../products/services/products.services';
import { WarehouseService } from '../../../warehouse/services/warehouse.services';
import { OrderRequest } from '../../models/sales-order.model';
import { SalesOrderService } from '../../services/sales-order.services';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';

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
  customerId: number | null;
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
    ReactiveFormsModule,
    AutoCompleteModule,
    ButtonModule,
    ConfirmDialogModule,
    DatePickerModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    InputTextModule,
    PaginatorModule,
    SelectModule,
    TableModule,
    TagModule,
    ToastModule,
    MetricCardComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './sales-order-detail.html',
  styleUrls: ['./sales-order-detail.scss'],
})
export class SalesOrderDetail {
  private readonly orderService = inject(SalesOrderService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly warehouseService = inject(WarehouseService);
  private readonly productService = inject(ProductsService);
  private readonly exportService = inject(ExportService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  salesOrderForm: FormGroup;
  orders: Order[] = [];
  items: any[] = [];
  customerItems: any[] = [];
  warehouseItems: any[] = [];
  productItems: any[] = [];
  filteredItems: any[] = [];
  filteredWarehouseItems: any[] = [];
  filteredProductItems: any[] = [];

  order: Order = this.createEmptyOrder();
  selectedCustomer: any = null;
  selectedWarehouse: any = null;
  selectedProduct: any = null;

  orderDialog = false;
  submitted = false;
  isEditMode = false;

  expandedRows: { [key: number]: boolean } = {};
  totalCount = 0;
  pageSize = 5;
  page = 1;

  statusOptions = [
    { label: 'Pending', value: 1 },
    { label: 'Processing', value: 2 },
    { label: 'Completed', value: 3 },
  ];

  constructor() {
    this.salesOrderForm = this.createOrderForm();
  }

  ngOnInit() {
    this.loadOrderDetails();
    this.loadCustomers();
    this.loadWarehouses();
    this.loadProducts();
  }

  get orderDetails(): FormArray {
    return this.salesOrderForm.get('orderDetails') as FormArray;
  }

  private createOrderForm(): FormGroup {
    return this.fb.group({
      customerId: [null, Validators.required],
      orderDate: [new Date(), Validators.required],
      statusId: [1, Validators.required],
      orderDetails: this.fb.array([], Validators.required),
    });
  }

  private createOrderDetailFormGroup(detail?: OrderDetail): FormGroup {
    return this.fb.group({
      productId: [detail?.productId || null],
      productName: [detail?.productName || '', Validators.required],
      warehouseId: [detail?.warehouseId || null, Validators.required],
      quantity: [detail?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [detail?.unitPrice || 0, [Validators.required, Validators.min(0)]],
    });
  }

  private createEmptyOrder(): Order {
    return {
      orderId: 0,
      customerId: null,
      statusId: 0,
      orderDetails: [],
      orderDate: '',
      customerName: '',
      totalAmount: 0,
      statusName: '',
      createdByUserId: 0,
    };
  }

  private loadOrderDetails(page = 1, pageSize = 5) {
    this.orderService.getAllSalesOrder(page, pageSize).subscribe({
      next: (res) => {
        this.items = res.result.data;
        this.totalCount = res.result.meta.totalCount;
        this.page = res.result.meta.page;
        this.pageSize = res.result.meta.pageSize;
        console.log(res.result.data);
      },
      error: (err) => {
        this.notification.error(
          'Error!!',
          `${err.error.message}` || 'Failed to Load Order Details'
        );
      },
    });
  }

  private loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (res) => {
        this.customerItems = res.result.map((val: any) => ({
          label: val.name,
          value: val.customerId,
        }));
        console.log(this.items, 'itemss');
      },
      error: () => {
        this.notification.error('Error!!', 'Failed to Load Categories');
      },
    });
  }

  private loadWarehouses(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (res) => {
        this.warehouseItems = res.result.map((val: any) => ({
          label: val.name,
          value: val.warehouseId,
        }));
        console.log(this.items, 'itemss');
      },
      error: () => {
        this.notification.error('Error!!', 'Failed to Load Categories');
      },
    });
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.productItems = res.result.data.map((val: any) => ({
          label: val.name,
          value: val.productId,
        }));
        console.log(this.items, 'itemss');
      },
      error: () => {
        this.notification.error('Error!!', 'Failed to Load Products');
      },
    });
  }

  private createSalesOrder(orderRequest: OrderRequest): void {
    this.orderService.createSalesOrder(orderRequest).subscribe({
      next: () => {
        this.notification.success('Success', 'Order Created Successfully');
        this.hideDialog();
        this.loadOrderDetails();
      },
      error: (err) => {
        this.notification.error('Error', `${err.error.message}` || 'Failed to Create Order');
      },
    });
  }

  private updateSalesOrder(orderRequest: OrderRequest): void {
    this.orderService.updateSalesOrder(this.order.orderId, orderRequest).subscribe({
      next: () => {
        this.notification.success('Success', 'Order Updated Successfully');
        this.hideDialog();
        this.loadOrderDetails();
        this.isEditMode = false;
      },
      error: (err) => {
        this.notification.error('Error!', err.error?.message || 'Failed to Update Order Details');
      },
    });
  }

  private buildSalesOrderRequest(): OrderRequest & { orderId?: number } {
    const formValue = this.salesOrderForm.value;

    return {
      orderId: this.order?.orderId ?? undefined,
      customerId: formValue.customerId?.value ?? formValue.customerId,
      statusId: formValue.statusId,
      orderDetails: formValue.orderDetails.map((detail: any) => ({
        productId: detail.productId?.value ?? detail.productId,
        warehouseId: detail.warehouseId?.value ?? detail.warehouseId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
      })),
    };
  }

  openNew() {
    this.salesOrderForm.reset({
      orderId: 0,
      customerId: null,
      orderDate: new Date(),
      statusId: 1,
    });
    this.selectedCustomer = null;
    this.orderDetails.clear();
    this.addOrderDetail();
    this.isEditMode = false;
    this.orderDialog = true;
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
    this.selectedCustomer = null;
  }

  addOrderDetail() {
    this.orderDetails.push(this.createOrderDetailFormGroup());
  }

  removeOrderDetail(index: number) {
    this.orderDetails.removeAt(index);
  }

  searchCustomer(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredItems =
      this.customerItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  searchWarehouse(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredWarehouseItems =
      this.warehouseItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  searchProduct(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredProductItems =
      this.productItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  saveOrder() {
    this.submitted = true;

    const orderRequest = this.buildSalesOrderRequest();
    console.log('Sending order request:', orderRequest);

    if (this.isEditMode) {
      this.updateSalesOrder(orderRequest);
    } else {
      this.createSalesOrder(orderRequest);
    }
  }

  editOrder(order: Order) {
    this.isEditMode = true;
    this.orderDialog = true;
    this.order = order;

    this.salesOrderForm.patchValue({
      orderId: order.orderId,
      orderDate: order.orderDate ? new Date(order.orderDate) : new Date(),
      statusId: order.statusId ?? 1,
    });

    const customerOption = this.customerItems.find((c) => c.value === order.customerId);
    this.selectedCustomer = customerOption ?? null;
    this.salesOrderForm.patchValue({
      customerId: this.selectedCustomer,
    });

    this.orderDetails.clear();

    if (order.orderDetails && order.orderDetails.length > 0) {
      for (const d of order.orderDetails) {
        const productOption = this.productItems.find((p) => p.value === d.productId);
        const warehouseOption = this.warehouseItems.find((w) => w.value === d.warehouseId);

        const fg = this.fb.group({
          productId: [
            productOption ?? { label: d.productName, value: d.productId },
            Validators.required,
          ],
          productName: [d.productName, Validators.required],
          warehouseId: [
            warehouseOption ?? { label: d.productName ?? '', value: d.warehouseId },
            Validators.required,
          ],
          quantity: [d.quantity, [Validators.required, Validators.min(1)]],
          unitPrice: [d.unitPrice, [Validators.required, Validators.min(0)]],
        });

        this.orderDetails.push(fg);
      }
    } else {
      this.addOrderDetail();
    }
  }

  deleteOrder(order: Order) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order #${order.orderId}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
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

  onPageChange(event: any): void {
    const page = event.first / event.rows + 1;
    const pageSize = event.rows;
    this.loadOrderDetails(page, pageSize);
  }

  exportCSV() {
    try {
      this.exportService.exportToExcel(this.orders),
        {
          fileName: 'Sales_Order_Excel_Export',
          sheetName: 'Sales Order Data',
        };
      this.notification.success('Export', 'Excel Export Completed');
    } catch (e) {
      this.notification.error('Export', 'Excel Export Failed');
    }
  }
}
