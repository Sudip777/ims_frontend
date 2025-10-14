import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';

// Services
import { ConfirmationService, MessageService } from 'primeng/api';

// Shared components
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { TagModule } from 'primeng/tag';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.services';
import { AuthStore } from '../../../../core/store/auth-store';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  imports: [
    CommonModule,
    FormsModule,

    // PrimeNG
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

    // Custom
    MetricCardComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class ProductDetail {
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  products: Product[] = [];
  selectedProducts: Product[] = [];
  product: Product = {
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
    createdAt: new Date(),
  };
  productDialog = false;
  submitted = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productsService: ProductsService,
    private authStore: AuthStore
  ) {}

  ngOnInit() {
    // Debug: Check if token exists
    const token = this.authStore.token();
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.result.data;
        console.log(data.result.data, 'dataa');
      },
      error: (err) => {
        console.error('Error fetching products', err);
      },
    });
  }

  // 🟢 Utility to create a new blank product
  createEmptyProduct(): Product {
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
      createdAt: new Date(),
    };
  }

  // 🟢 Open dialog for new product
  openNew() {
    this.product = this.createEmptyProduct();
    this.submitted = false;
    this.productDialog = true;
  }

  // 🟢 Hide dialog
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  // 🟢 Save (Create or Update)
  saveProduct() {
    this.submitted = true;

    if (this.product.name.trim()) {
      if (this.product.productId) {
        // Update existing
        const index = this.findIndexById(this.product.productId);
        if (index !== -1) this.products[index] = this.product;

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        // Create new
        this.product.productId = this.createId();
        this.products.push(this.product);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = this.createEmptyProduct();
    }
  }

  // 🟢 Edit
  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  // 🟢 Delete single
  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((p) => p.productId !== product.productId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  // 🟢 Delete multiple
  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => !this.selectedProducts.includes(val));
        this.selectedProducts = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  // 🟢 Export CSV placeholder
  exportCSV(event?: Event) {
    console.log('Export CSV clicked', event);
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'CSV Export started...',
      life: 3000,
    });
  }

  // 🟢 Helpers
  findIndexById(id: number): number {
    return this.products.findIndex((p) => p.productId === id);
  }

  createId(): number {
    return Math.floor(Math.random() * 10000) + 100;
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }
}
