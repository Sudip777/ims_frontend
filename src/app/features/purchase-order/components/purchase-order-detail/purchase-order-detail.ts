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
import { SupplierService } from '../../../supplier/services/supplier.services';
import { ProductsService } from '../../../products/services/products.services';
import { PurchaseOrderService } from '../../services/purchase-order.services';
import {
  PurchaseOrderDetailRequest,
  PurchaseOrderRequest,
} from '../../models/purchase-order.model';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';

export interface PurchaseOrderDetail {
  purchaseOrderDetailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface PurchaseOrder {
  purchaseOrderId: number;
  purchaseOrderDate: Date | string;
  supplierName: string;
  supplierId: number | null;
  statusId: number;
  statusName: string;
  totalAmount: number;
  createdByUserId: number;
  purchaseOrderDetails: PurchaseOrderDetail[];
}

@Component({
  selector: 'app-purchase-order-detail',
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
  templateUrl: './purchase-order-detail.html',
  styleUrls: ['./purchase-order-detail.scss'],
})
export class PurchaseOrderDetail {
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly supplierService = inject(SupplierService);
  private readonly productService = inject(ProductsService);
  private readonly exportService = inject(ExportService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  purchaseOrderForm: FormGroup;
  purchaseOrders: any[] = [];
  supplierItems: any[] = [];
  productItems: any[] = [];
  filteredSupplierItems: any[] = [];
  filteredProductItems: any[] = [];

  purchaseOrder: PurchaseOrder = this.createEmptyPurchaseOrder();
  selectedSupplier: any = null;
  selectedProduct: any = null;

  purchaseOrderDialog = false;
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
    this.purchaseOrderForm = this.createPurchaseOrderForm();
  }

  ngOnInit() {
    this.loadPurchaseOrders();
    this.loadSuppliers();
    this.loadProducts();
  }

  get purchaseOrderDetails(): FormArray {
    return this.purchaseOrderForm.get('purchaseOrderDetails') as FormArray;
  }

  private createPurchaseOrderForm(): FormGroup {
    return this.fb.group({
      supplierId: [null, Validators.required],
      purchaseOrderDate: [new Date(), Validators.required],
      statusId: [1, Validators.required],
      purchaseOrderDetails: this.fb.array([], Validators.required),
    });
  }

  private createPurchaseOrderDetailFormGroup(detail?: PurchaseOrderDetail): FormGroup {
    return this.fb.group({
      productId: [detail?.productId || null, Validators.required],
      productName: [detail?.productName || '', Validators.required],
      purchaseOrderDate: [new Date(), Validators.required],
      quantity: [detail?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [detail?.unitPrice || 0, [Validators.required, Validators.min(0)]],
    });
  }

  private createEmptyPurchaseOrder(): PurchaseOrder {
    return {
      purchaseOrderId: 0,
      supplierId: null,
      supplierName: '',
      purchaseOrderDate: '',
      statusId: 1,
      statusName: 'Pending',
      totalAmount: 0,
      createdByUserId: 0,
      purchaseOrderDetails: [],
    };
  }

  private loadPurchaseOrders(page = 1, pageSize = 5) {
    this.purchaseOrderService.getAllPurchaseOrders(page, pageSize).subscribe({
      next: (res) => {
        this.purchaseOrders = res.result.data;
        this.totalCount = res.result.meta.totalCount;
        this.page = res.result.meta.page;
        this.pageSize = res.result.meta.pageSize;
        console.log(this.purchaseOrders, 'abccc');
      },
      error: (err) => {
        this.notification.error(
          'Error!!',
          `${err.error.message}` || 'Failed to Load Purchase Orders'
        );
      },
    });
  }

  private loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (res) => {
        this.supplierItems = res.result.map((val: any) => ({
          label: val.name,
          value: val.supplierId,
        }));
      },
      error: () => {
        this.notification.error('Error!!', 'Failed to Load Suppliers');
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
      },
      error: () => {
        this.notification.error('Error!!', 'Failed to Load Products');
      },
    });
  }

  private createPurchaseOrderRequest(): PurchaseOrderRequest {
    const formValue = this.purchaseOrderForm.value as {
      supplierId: number | { value: number } | null;
      statusId: number | string;
      purchaseOrderDetails: Array<{
        productId: number | { value: number };
        quantity: number;
        unitPrice: number;
      }>;
    };

    const normalizedSupplierId =
      typeof formValue.supplierId === 'object' && formValue.supplierId !== null
        ? Number(formValue.supplierId.value)
        : Number(formValue.supplierId ?? 0);

    const normalizedDetails = formValue.purchaseOrderDetails.map((detail) => {
      const productId =
        typeof detail.productId === 'object'
          ? Number(detail.productId.value)
          : Number(detail.productId);

      // Derive productName from a known selected option list if available
      const productOption = this.productItems.find((p) => p.value === productId);
      const productName = productOption?.label ?? '';

      return {
        productId,
        productName,
        quantity: Number(detail.quantity),
        unitPrice: Number(detail.unitPrice),
      } as PurchaseOrderDetailRequest;
    });

    return {
      supplierId: normalizedSupplierId,
      statusId: Number(formValue.statusId),
      purchaseOrderDetails: normalizedDetails,
    } as PurchaseOrderRequest;
  }

  private createPurchaseOrder(request: PurchaseOrderRequest): void {
    this.purchaseOrderService.createPurchaseOrder(request).subscribe({
      next: () => {
        this.notification.success('Success', 'Purchase Order Created Successfully');
        this.hideDialog();
        this.loadPurchaseOrders();
      },
      error: (err) => {
        this.notification.error('Error', `${err.error.message}` || 'Failed to Create Order');
      },
    });
  }

  private updatePurchaseOrder(request: PurchaseOrderRequest): void {
    this.purchaseOrderService
      .updatePurchaseOrder(this.purchaseOrder.purchaseOrderId, request)
      .subscribe({
        next: () => {
          this.notification.success('Success', 'Purchase Order Updated Successfully');
          this.hideDialog();
          this.loadPurchaseOrders();
          this.isEditMode = false;
        },
        error: (err) => {
          this.notification.error(
            'Error!',
            err.error?.message || 'Failed to Update Purchase Order'
          );
        },
      });
  }

  openNew() {
    this.purchaseOrderForm.reset({
      purchaseOrderId: 0,
      supplierId: null,
      purchaseOrderDate: new Date(),
      statusId: 1,
    });
    this.selectedSupplier = null;
    this.purchaseOrderDetails.clear();
    this.addPurchaseOrderDetail();
    this.isEditMode = false;
    this.purchaseOrderDialog = true;
  }

  hideDialog() {
    this.purchaseOrderDialog = false;
    this.submitted = false;
    this.selectedSupplier = null;
  }

  addPurchaseOrderDetail() {
    this.purchaseOrderDetails.push(this.createPurchaseOrderDetailFormGroup());
  }

  removePurchaseOrderDetail(index: number) {
    this.purchaseOrderDetails.removeAt(index);
  }

  searchSupplier(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredSupplierItems =
      this.supplierItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  searchProduct(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredProductItems =
      this.productItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  savePurchaseOrder() {
    this.submitted = true;
    const request = this.createPurchaseOrderRequest();

    if (this.isEditMode) {
      this.updatePurchaseOrder(request);
    } else {
      this.createPurchaseOrder(request);
    }
  }

  editPurchaseOrder(po: PurchaseOrder) {
    this.isEditMode = true;
    this.purchaseOrderDialog = true;
    this.purchaseOrder = po;

    this.purchaseOrderForm.patchValue({
      purchaseOrderId: po.purchaseOrderId,
      purchaseOrderDate: po.purchaseOrderDate ? new Date(po.purchaseOrderDate) : new Date(),
      statusId: po.statusId ?? 1,
    });

    const supplierOption = this.supplierItems.find((s) => s.value === po.supplierId);
    this.selectedSupplier = supplierOption ?? null;
    this.purchaseOrderForm.patchValue({
      supplierId: this.selectedSupplier,
    });

    this.purchaseOrderDetails.clear();

    if (po.purchaseOrderDetails && po.purchaseOrderDetails.length > 0) {
      for (const d of po.purchaseOrderDetails) {
        const productOption = this.productItems.find((p) => p.value === d.productId);

        const fg = this.fb.group({
          productId: [
            productOption ?? { label: d.productName, value: d.productId },
            Validators.required,
          ],
          productName: [d.productName, Validators.required],
          quantity: [d.quantity, [Validators.required, Validators.min(1)]],
          unitPrice: [d.unitPrice, [Validators.required, Validators.min(0)]],
        });

        this.purchaseOrderDetails.push(fg);
      }
    } else {
      this.addPurchaseOrderDetail();
    }
  }

  deletePurchaseOrder(po: PurchaseOrder) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Purchase Order #${po.purchaseOrderId}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.purchaseOrders = this.purchaseOrders.filter(
          (p) => p.purchaseOrderId !== po.purchaseOrderId
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

  onPageChange(event: any): void {
    const page = event.first / event.rows + 1;
    const pageSize = event.rows;
    this.loadPurchaseOrders(page, pageSize);
  }

  exportCSV() {
    try {
      this.exportService.exportToExcel(this.purchaseOrders),
        {
          fileName: 'Purchase_Order_Excel_Export',
          sheetName: 'Purchase Order Data',
        };
      this.notification.success('Export', 'Excel Export Completed');
    } catch (e) {
      this.notification.error('Export', 'Excel Export Failed');
    }
  }
}
