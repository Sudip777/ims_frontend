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

interface Product {
  ProductId: number;
  Name: string;
  SKU: string;
  UnitPrice: number;
  CostPrice: number;
  SupplierId: number;
  CategoryId?: number;
  ReorderLevel: number;
  MinStock: number;
  MaxStock: number;
  IsActive: boolean;
  CreatedAt: string;
  Image: string;
}

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
    ProductId: 0,
    Name: '',
    SKU: '',
    UnitPrice: 0,
    CostPrice: 0,
    SupplierId: 0,
    ReorderLevel: 0,
    MinStock: 0,
    MaxStock: 0,
    IsActive: false,
    CreatedAt: '',
    Image: '',
  };
  productDialog = false;
  submitted = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // 🧪 Fake backend-style sample data
    this.products = [
      {
        ProductId: 1,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 2,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 3,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 4,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 5,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 6,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
      {
        ProductId: 7,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 8,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 9,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 10,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 11,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 12,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
      {
        ProductId: 13,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 14,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 15,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 16,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 17,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 18,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
      {
        ProductId: 19,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 20,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 21,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 22,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 23,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 24,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
      {
        ProductId: 25,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 26,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 27,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 28,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 29,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 30,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
      {
        ProductId: 31,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 32,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 33,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 34,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 35,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 36,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
      {
        ProductId: 37,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 38,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 39,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 40,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 41,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 42,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
      {
        ProductId: 43,
        Name: 'Wireless Mouse',
        SKU: 'WM-1001',
        UnitPrice: 25.99,
        CostPrice: 15.5,
        SupplierId: 2,
        CategoryId: 3,
        ReorderLevel: 15,
        MinStock: 5,
        MaxStock: 100,
        IsActive: true,
        CreatedAt: '2025-09-15T10:23:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg',
      },
      {
        ProductId: 44,
        Name: 'Gaming Keyboard',
        SKU: 'GK-2050',
        UnitPrice: 89.99,
        CostPrice: 60.0,
        SupplierId: 4,
        CategoryId: 3,
        ReorderLevel: 10,
        MinStock: 2,
        MaxStock: 50,
        IsActive: true,
        CreatedAt: '2025-08-12T14:05:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
      },
      {
        ProductId: 45,
        Name: 'Bluetooth Headphones',
        SKU: 'BH-3002',
        UnitPrice: 120.5,
        CostPrice: 80.0,
        SupplierId: 1,
        CategoryId: 3,
        ReorderLevel: 20,
        MinStock: 10,
        MaxStock: 200,
        IsActive: true,
        CreatedAt: '2025-07-10T09:15:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
      },
      {
        ProductId: 46,
        Name: 'Leather Wallet',
        SKU: 'LW-4501',
        UnitPrice: 45.0,
        CostPrice: 25.0,
        SupplierId: 3,
        CategoryId: 2,
        ReorderLevel: 12,
        MinStock: 5,
        MaxStock: 80,
        IsActive: true,
        CreatedAt: '2025-06-20T11:30:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
      },
      {
        ProductId: 47,
        Name: 'Smart Watch',
        SKU: 'SW-5500',
        UnitPrice: 199.99,
        CostPrice: 150.0,
        SupplierId: 5,
        CategoryId: 3,
        ReorderLevel: 8,
        MinStock: 3,
        MaxStock: 60,
        IsActive: false,
        CreatedAt: '2025-05-05T13:45:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/brown-purse.jpg',
      },
      {
        ProductId: 48,
        Name: 'USB-C Cable (1m)',
        SKU: 'UC-6001',
        UnitPrice: 12.5,
        CostPrice: 6.0,
        SupplierId: 2,
        CategoryId: 1,
        ReorderLevel: 30,
        MinStock: 10,
        MaxStock: 300,
        IsActive: true,
        CreatedAt: '2025-09-01T08:50:00Z',
        Image: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
      },
    ];
  }

  // 🟢 Utility to create a new blank product
  createEmptyProduct(): Product {
    return {
      ProductId: 0,
      Name: '',
      SKU: '',
      UnitPrice: 0,
      CostPrice: 0,
      SupplierId: 0,
      CategoryId: undefined,
      ReorderLevel: 0,
      MinStock: 0,
      MaxStock: 0,
      IsActive: true,
      CreatedAt: new Date().toISOString(),
      Image: '',
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

    if (this.product.Name.trim()) {
      if (this.product.ProductId) {
        // Update existing
        const index = this.findIndexById(this.product.ProductId);
        if (index !== -1) this.products[index] = this.product;

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        // Create new
        this.product.ProductId = this.createId();
        this.product.Image =
          this.product.Image ||
          'https://primefaces.org/cdn/primeng/images/demo/product/new-product.jpg';
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
      message: `Are you sure you want to delete "${product.Name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((p) => p.ProductId !== product.ProductId);
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
    return this.products.findIndex((p) => p.ProductId === id);
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
