import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Subscription } from 'rxjs';
import { ExportService } from '../../../../core/services/export.services';
import { NotificationService } from '../../../../core/services/notification.services';
import { SearchService } from '../../../../core/services/search.services';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { CategoryService } from '../../../category/services/category.services';
import { SupplierService } from '../../../supplier/services/supplier.services';
import { Product, ProductRequest, ProductUpdate } from '../../models/product.model';
import { ProductsService } from '../../services/products.services';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.html',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FileUploadModule,
    ConfirmDialogModule,
    ToastModule,
    RadioButtonModule,
    SelectModule,
    TextareaModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    TagModule,
    AutoCompleteModule,
    MetricCardComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class ProductDetail implements OnInit, OnDestroy {
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly productsService = inject(ProductsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);
  private readonly exportService = inject(ExportService);
  private readonly searchService = inject(SearchService);
  private searchSubscription: Subscription | undefined;

  products: Product[] = [];
  selectedProducts: Product[] = [];
  items: { label: string; value: number }[] = [];
  supplierItems: { label: string; value: number }[] = [];
  filteredItems: unknown[] = [];
  filteredSupplierItems: unknown[] = [];
  productDialog = false;
  submitted = false;
  isEditMode = false;
  selectedCategory: number | null = null;
  selectedSupplier: number | null = null;

  product: Product = this.createEmptyProduct();

  totalCount = 0;
  pageSize = 5;
  page = 1;
  date: Date | null = null;
  globalFilterFields: unknown;
  globalSearchText = '';

  ngOnInit() {
    // debouncing searchh
    this.searchSubscription = this.searchService.getSearchTime(300).subscribe((term) => {
      this.globalSearchText = term;
      this.loadProducts(1, this.pageSize, this.globalSearchText, 'productId', 'asc');
    });
    this.loadCategories();
    this.loadSuppliers();
  }
  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  private loadProducts(
    page: number,
    pageSize: number,
    search?: string,
    sortColumn?: string | string[] | null | undefined,
    sortDirection?: string,
  ): void {
    this.productsService
      .getAllProducts(page, pageSize, search, sortColumn, sortDirection)
      .subscribe({
        next: (res) => {
          this.products = res.result.data;
          this.totalCount = res.result.meta.totalCount;
          this.page = res.result.meta.page;
          this.pageSize = res.result.meta.pageSize;
        },
        error: () => {
          this.notificationService.error('Error!!', 'Failed to Load Products');
        },
      });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.items = res.result.map((val) => ({
          label: val.categoryName,
          value: val.categoryId,
        }));
      },
      error: () => {
        this.notificationService.error('Error!!', 'Failed to Load Categories');
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
        this.notificationService.error('Error!!', 'Failed to Load Suppliers');
      },
    });
  }

  onPageChange(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = first / rows + 1;
    const pageSize = rows;

    const sortColumn: string | string[] | null | undefined = event.sortField ?? 'productId';
    const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
    const search = this.globalSearchText ?? '';

    this.loadProducts(page, pageSize, search, sortColumn, sortDirection);
  }
  onSearchInput(value: string) {
    this.searchService.setSearchTerm(value);
  }

  openNew(): void {
    this.isEditMode = false;
    this.product = this.createEmptyProduct();
    this.selectedCategory = null;
    this.selectedSupplier = null;
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product): void {
    this.isEditMode = true;
    this.product = { ...product };
    this.selectedCategory = product.categoryId;
    this.selectedSupplier = product.supplierId;
    this.productDialog = true;
  }

  hideDialog(): void {
    this.productDialog = false;
    this.product = this.createEmptyProduct();
    this.selectedCategory = null;
    this.selectedSupplier = null;
    this.submitted = false;
  }

  saveProduct(): void {
    this.submitted = true;

    if (!this.product.name || !this.product.sku) {
      this.notificationService.warn('Validation Error', 'Name and SKU are required');
      return;
    }

    const request = this.buildProductRequest();

    if (this.isEditMode) {
      this.updateProduct(request);
    } else {
      this.createProduct(request);
    }
  }

  private createProduct(request: ProductRequest): void {
    this.productsService.createProduct(request).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Product created successfully');
        this.hideDialog();
        this.loadProducts(this.page, this.pageSize);
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to create product');
      },
    });
  }

  private updateProduct(request: ProductUpdate): void {
    this.productsService.updateProduct(this.product.productId, request).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Product updated successfully');
        this.hideDialog();
        this.loadProducts(this.page, this.pageSize);
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to update product');
      },
    });
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productsService.deleteProduct(product.productId).subscribe({
          next: () => {
            this.notificationService.success('Success', 'Product deleted successfully');
            this.loadProducts(this.page, this.pageSize);
          },
          error: () => {
            this.notificationService.error('Error', 'Failed to delete product');
          },
        });
      },
    });
  }

  deleteSelectedProducts(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => !this.selectedProducts.includes(val));
        this.selectedProducts = [];

        this.notificationService.success('Success', 'Products deleted successfully');
      },
    });
  }

  exportExcel() {
    try {
      this.exportService.exportToExcel(this.products as never, {
        fileName: 'Products_Excel_Report',
        sheetName: 'Product Data',
        title: 'The Unity Ware Excel Report',
      });

      this.notificationService.success('Export', 'Excel Export Completed');
    } catch (err) {
      this.notificationService.error('Export', `Excel Export Failed || ${err}`);
    }
  }

  search(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredItems =
      this.items.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  searchSupplier(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredSupplierItems =
      this.supplierItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }

  private createEmptyProduct(): Product {
    return {
      productId: 0,
      name: '',
      supplierName: null,
      sku: '',
      unitPrice: 0,
      costPrice: 0,
      supplierId: 0,
      categoryId: 0,
      categoryName: '',
      reorderLevel: 0,
      minStock: 0,
      maxStock: 0,
      isActive: true,
    };
  }

  private buildProductRequest(): ProductRequest {
    return {
      name: this.product.name,
      sku: this.product.sku,
      supplierId: this.selectedSupplier || this.product.supplierId,
      categoryId: this.selectedCategory || this.product.categoryId,
      unitPrice: this.product.unitPrice,
      costPrice: this.product.costPrice,
      reorderLevel: this.product.reorderLevel,
      minStock: this.product.minStock,
      maxStock: this.product.maxStock,
      isActive: this.product.isActive,
    };
  }
}
