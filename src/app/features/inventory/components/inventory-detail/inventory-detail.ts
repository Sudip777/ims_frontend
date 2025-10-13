import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
interface Inventory {
  InventoryId: number;
  ProductId: number;
  ProductName: string;
  WarehouseId: number;
  WarehouseName: string;
  Quantity: number;
  ReorderLevel: number;
  CreatedByUserId: number;
}
@Component({
  selector: 'app-inventory-detail',
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
  templateUrl: './inventory-detail.html',
  styleUrl: './inventory-detail.scss',
})
export class InventoryDetail {
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  inventories: Inventory[] = [];
  selectedInventories: Inventory[] = [];

  inventory: Inventory = {
    InventoryId: 0,
    ProductId: 0,
    ProductName: '',
    WarehouseId: 0,
    WarehouseName: '',
    Quantity: 0,
    ReorderLevel: 0,
    CreatedByUserId: 0,
  };
  inventoryDialog = false;
  submitted = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Customer data
    this.inventories = [
      {
        InventoryId: 1,
        ProductId: 101,
        ProductName: 'Wireless Mouse',
        WarehouseId: 201,
        WarehouseName: 'Central Warehouse',
        Quantity: 120,
        ReorderLevel: 20,
        CreatedByUserId: 1,
      },
      {
        InventoryId: 2,
        ProductId: 102,
        ProductName: 'Mechanical Keyboard',
        WarehouseId: 202,
        WarehouseName: 'East Warehouse',
        Quantity: 80,
        ReorderLevel: 15,
        CreatedByUserId: 2,
      },
      {
        InventoryId: 3,
        ProductId: 103,
        ProductName: '27-inch Monitor',
        WarehouseId: 203,
        WarehouseName: 'West Warehouse',
        Quantity: 50,
        ReorderLevel: 10,
        CreatedByUserId: 3,
      },
      {
        InventoryId: 4,
        ProductId: 104,
        ProductName: 'USB-C Cable',
        WarehouseId: 201,
        WarehouseName: 'Central Warehouse',
        Quantity: 300,
        ReorderLevel: 50,
        CreatedByUserId: 4,
      },
      {
        InventoryId: 5,
        ProductId: 105,
        ProductName: 'External Hard Drive',
        WarehouseId: 202,
        WarehouseName: 'East Warehouse',
        Quantity: 45,
        ReorderLevel: 10,
        CreatedByUserId: 5,
      },
      {
        InventoryId: 6,
        ProductId: 106,
        ProductName: 'Bluetooth Speaker',
        WarehouseId: 204,
        WarehouseName: 'North Warehouse',
        Quantity: 75,
        ReorderLevel: 15,
        CreatedByUserId: 6,
      },
      {
        InventoryId: 7,
        ProductId: 107,
        ProductName: 'Webcam HD 1080p',
        WarehouseId: 203,
        WarehouseName: 'West Warehouse',
        Quantity: 90,
        ReorderLevel: 20,
        CreatedByUserId: 7,
      },
      {
        InventoryId: 8,
        ProductId: 108,
        ProductName: 'Laptop Stand',
        WarehouseId: 201,
        WarehouseName: 'Central Warehouse',
        Quantity: 130,
        ReorderLevel: 25,
        CreatedByUserId: 8,
      },
      {
        InventoryId: 9,
        ProductId: 109,
        ProductName: 'Wireless Charger',
        WarehouseId: 204,
        WarehouseName: 'North Warehouse',
        Quantity: 95,
        ReorderLevel: 20,
        CreatedByUserId: 9,
      },
      {
        InventoryId: 10,
        ProductId: 110,
        ProductName: 'Smartwatch',
        WarehouseId: 202,
        WarehouseName: 'East Warehouse',
        Quantity: 60,
        ReorderLevel: 15,
        CreatedByUserId: 10,
      },
      {
        InventoryId: 11,
        ProductId: 111,
        ProductName: 'Noise Cancelling Headphones',
        WarehouseId: 203,
        WarehouseName: 'West Warehouse',
        Quantity: 40,
        ReorderLevel: 10,
        CreatedByUserId: 11,
      },
    ];
  }

  createEmptyInventory(): Inventory {
    return {
      InventoryId: 0,
      ProductId: 0,
      ProductName: '',
      WarehouseId: 0,
      WarehouseName: '',
      Quantity: 0,
      ReorderLevel: 0,
      CreatedByUserId: 0,
    };
  }
  // 🟢 Open dialog for new product
  openNew() {
    this.inventory = this.createEmptyInventory();
    this.submitted = false;
    this.inventoryDialog = true;
  }

  // 🟢 Hide dialog
  hideDialog() {
    this.inventoryDialog = false;
    this.submitted = false;
  }

  // 🟢 Save (Create or Update)
  saveInventory() {
    this.submitted = true;

    if (this.inventory.ProductName.trim()) {
      if (this.inventory.InventoryId) {
        // Update existing
        const index = this.findIndexById(this.inventory.InventoryId);
        if (index !== -1) this.inventories[index] = this.inventory;

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Inventory Updated',
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Category Created',
          life: 3000,
        });
      }

      this.inventories = [...this.inventories];
      this.inventoryDialog = false;
      this.inventory = this.createEmptyInventory();
    }
  }

  // 🟢 Edit
  editCustomer(inventory: Inventory) {
    this.inventory = { ...inventory };
    this.inventoryDialog = true;
  }

  // 🟢 Delete single
  deleteInventory(inventory: Inventory) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${inventory.InventoryId}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventories = this.inventories.filter((p) => p.InventoryId !== inventory.InventoryId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Inventory Deleted',
          life: 3000,
        });
      },
    });
  }

  // 🟢 Delete multiple
  deleteSelectedInventories() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Suppliers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventories = this.inventories.filter(
          (val) => !this.selectedInventories.includes(val)
        );
        this.selectedInventories = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'inventories Deleted',
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
    return this.inventories.findIndex((p) => p.InventoryId === id);
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
