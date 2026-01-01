import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
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
import { TableLazyLoadEvent, TableModule, TableRowExpandEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { Subscription } from 'rxjs';
import { DropdownItem } from '../../../../core/models/drop-down.model';
import { ExportService } from '../../../../core/services/export.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchService } from '../../../../core/services/search.service';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { AuthRoutingModule } from '../../../auth/auth-routing-module';
import { ProductsService } from '../../../products/services/products.services';
import { SupplierService } from '../../../supplier/services/supplier.services';
import {
  PurchaseOrder,
  PurchaseOrderDetailRequest,
  PurchaseOrderDetailType,
  PurchaseOrderRequest,
} from '../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.services';

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
    Avatar,
    Badge,
    AuthRoutingModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './purchase-order-detail.html',
  styleUrls: ['./purchase-order-detail.scss'],
})
export class PurchaseOrderDetail implements OnInit, OnDestroy {
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly supplierService = inject(SupplierService);
  private readonly productService = inject(ProductsService);
  private readonly exportService = inject(ExportService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly searchService = inject(SearchService);

  purchaseOrderForm: FormGroup;
  purchaseOrders: unknown[] = [];
  supplierItems: DropdownItem[] = [];
  productItems: DropdownItem[] = [];
  filteredSupplierItems: unknown[] = [];
  filteredProductItems: unknown[] = [];

  purchaseOrder: PurchaseOrder = this.createEmptyPurchaseOrder();
  selectedSupplier: unknown = null;
  selectedProduct: unknown = null;

  purchaseOrderDialog = false;
  submitted = false;
  isEditMode = false;

  expandedRows: Record<number, boolean> = {};
  totalCount = 0;
  pageSize = 5;
  page = 1;

  private searchSubscription: Subscription | undefined;
  purchaseOrderSearchText = '';

  severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined = null;

  statusOptions = [
    { label: 'Pending', value: 1 },
    { label: 'Processing', value: 2 },
    { label: 'Completed', value: 3 },
  ];

  constructor() {
    this.purchaseOrderForm = this.createPurchaseOrderForm();
  }

  ngOnInit() {
    this.loadSuppliers();
    this.loadProducts();

    //debouncedd search
    this.searchSubscription = this.searchService.getSearchTime(300).subscribe((term) => {
      this.purchaseOrderSearchText = term;
      this.loadPurchaseOrders(this.page, this.pageSize, this.purchaseOrderSearchText, 'purchaseOrderId', 'asc');
    });
  }
  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  onPageChange(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = first / rows + 1;
    const pageSize = rows;

    const sortColumn: string | string[] | null | undefined = event.sortField ?? 'productId';
    const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
    const search = this.purchaseOrderSearchText ?? '';

    this.loadPurchaseOrders(page, pageSize, search, sortColumn, sortDirection);
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

  private createPurchaseOrderDetailFormGroup(detail?: PurchaseOrderDetailType): FormGroup {
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
      supplierId: 0,
      supplierName: '',
      orderDate: new Date(),
      statusId: 0,
      statusName: '',
      totalAmount: 0,
      createdByUserId: 0,
      purchaseOrderDetails: [],
    };
  }

  private loadPurchaseOrders(
    page: number,
    pageSize: number,
    search?: string,
    sortColumn?: string | string[] | null | undefined,
    sortDirection?: 'asc' | 'desc'
  ) {
    this.purchaseOrderService.getAllPurchaseOrders(page, pageSize, search, sortColumn, sortDirection).subscribe({
      next: (res) => {
        this.purchaseOrders = res.result.data;
        this.totalCount = res.result.meta.totalCount;
        this.page = res.result.meta.page;
        this.pageSize = res.result.meta.pageSize;
        console.log(this.purchaseOrders, 'abccc');
      },
      error: (err) => {
        this.notification.error('Error!!', `${err.error.message}` || 'Failed to Load Purchase Orders');
      },
    });
  }

  private loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (res) => {
        this.supplierItems = res.result.map((val) => ({
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
        this.productItems = res.result.data.map((val) => ({
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
      supplierId: number | DropdownItem | null;
      statusId: number | string;
      purchaseOrderDetails: {
        productId: number | DropdownItem;
        quantity: number;
        unitPrice: number;
      }[];
    };

    const normalizedSupplierId =
      typeof formValue.supplierId === 'object' && formValue.supplierId !== null
        ? formValue.supplierId.value
        : Number(formValue.supplierId ?? 0);

    const normalizedDetails = formValue.purchaseOrderDetails.map((detail) => {
      const productId = typeof detail.productId === 'object' ? detail.productId.value : Number(detail.productId);

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
    };
  }

  private createPurchaseOrder(request: PurchaseOrderRequest): void {
    this.purchaseOrderService.createPurchaseOrder(request).subscribe({
      next: () => {
        this.notification.success('Success', 'Purchase Order Created Successfully');
        this.hideDialog();
        this.loadPurchaseOrders(this.page, this.pageSize);
      },
      error: (err) => {
        this.notification.error('Error', `${err.error.message}` || 'Failed to Create Order');
      },
    });
  }

  private updatePurchaseOrder(request: PurchaseOrderRequest): void {
    this.purchaseOrderService.updatePurchaseOrder(this.purchaseOrder.purchaseOrderId, request).subscribe({
      next: () => {
        this.notification.success('Success', 'Purchase Order Updated Successfully');
        this.hideDialog();
        this.loadPurchaseOrders(this.page, this.pageSize);
        this.isEditMode = false;
      },
      error: (err) => {
        this.notification.error('Error!', err.error?.message || 'Failed to Update Purchase Order');
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

  onSearchInput(value: string) {
    this.searchService.setSearchTerm(value);
  }
  searchSupplier(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredSupplierItems = this.supplierItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  searchProduct(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredProductItems = this.productItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
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
      purchaseOrderDate: po.orderDate ? new Date(po.orderDate) : new Date(),
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
          productId: [productOption ?? { label: d.productName, value: d.productId }, Validators.required],
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
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.purchaseOrders = (this.purchaseOrders as PurchaseOrder[]).filter(
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

  onRowExpand(event: TableRowExpandEvent) {
    if (event.data) {
      this.expandedRows[event.data.purchaseOrderId] = true;
      this.expandedRows = { ...this.expandedRows };
      this.purchaseOrders = [...this.purchaseOrders];
    }
  }

  onRowCollapse(event: { data: PurchaseOrder }) {
    if (event.data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [event.data.purchaseOrderId]: _, ...rest } = this.expandedRows;
      this.expandedRows = rest;
      this.purchaseOrders = [...this.purchaseOrders];
    }
  }

  exportCSV() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.exportService.exportToExcel(this.purchaseOrders as never),
        {
          fileName: 'Purchase_Order_Excel_Export',
          sheetName: 'Purchase Order Data',
        };
      this.notification.success('Export', 'Excel Export Completed');
    } catch (e) {
      this.notification.error('Export', `Excel Export Failed | ${e}`);
    }
  }
  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      Pending: 'warn',
      Approved: 'success',
      Rejected: 'danger',
      Completed: 'info',
      Cancelled: 'secondary',
    };
    return severityMap[status] || 'info';
  }

  getStatusIcon(status: string): string {
    const iconMap: Record<string, string> = {
      Pending: 'pi pi-clock',
      Approved: 'pi pi-check-circle',
      Rejected: 'pi pi-times-circle',
      Completed: 'pi pi-check',
      Cancelled: 'pi pi-ban',
    };
    return iconMap[status] || 'pi pi-info-circle';
  }
}
