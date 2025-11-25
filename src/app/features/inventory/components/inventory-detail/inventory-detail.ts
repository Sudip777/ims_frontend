import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { Subscription } from 'rxjs';
import { ExportService } from '../../../../core/services/export.services';
import { NotificationService } from '../../../../core/services/notification.services';
import { SearchService } from '../../../../core/services/search.services';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { ProductsService } from '../../../products/services/products.services';
import { WarehouseService } from '../../../warehouse/services/warehouse.services';
import { InventoryService } from '../../services/inventory.services';

interface InventoryResponse {
  inventoryId: number;
  productId: number;
  productName?: string | null;
  warehouseId: number;
  warehouseName?: string | null;
  quantity: number;
  reorderLevel: number;
  createdbyUserId: number;
}

type InventoryRequest = Pick<InventoryResponse, 'productId' | 'warehouseId' | 'quantity'>;

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
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
    ToggleSwitchModule,
  ],
  templateUrl: './inventory-detail.html',
  styleUrl: './inventory-detail.scss',
})
export class InventoryDetail implements OnInit, OnDestroy {
  //DI
  private readonly inventoryService = inject(InventoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly productService = inject(ProductsService);
  private readonly warehouseService = inject(WarehouseService);
  private readonly exportService = inject(ExportService);
  private readonly searchService = inject(SearchService);

  // UI state
  inventories: InventoryResponse[] = [];
  selectedInventories: InventoryResponse[] = [];
  inventory: InventoryResponse = this.createEmptyInventory();
  inventoryDialog = false;
  submitted = false;
  isEditMode = false;
  productItems: { label: string; value: number }[] = [];
  warehouseItems: { label: string; value: number }[] = [];
  selectedProducts: number | { label: string; value: number } | null = null;
  selectedWarehouse: number | { label: string; value: number } | null = null;
  filteredItems: unknown[] = [];
  filteredWarehouseItems: unknown[] = [];
  checked = false;
  page = 1;
  pageSize = 5;
  totalCount = 0;
  inventoriesSearchText = '';
  private searchSubscription: Subscription | undefined;
  ngOnInit(): void {
    this.loadInventories(this.page, this.pageSize);

    this.searchSubscription = this.searchService.getSearchTime(300).subscribe((term) => {
      this.inventoriesSearchText = term;
      console.log('Search Term:', term);

      this.loadInventories(this.page, this.pageSize, this.inventoriesSearchText, 'inventoryId', 'asc');
    });
    this.loadCategories();
    this.loadProducts();
  }
  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
  private loadInventories(
    page: number,
    pageSize: number,
    search?: string,
    sortColumn?: string | string[] | null | undefined,
    sortDirection?: 'asc' | 'desc'
  ): void {
    this.inventoryService.getAllInventories(page, pageSize, search, sortColumn, sortDirection).subscribe({
      next: (res) => {
        this.inventories = res.result.data.map((item) => ({
          ...item,
          // isDisabled: item.quantity <= item.reorderLevel, // auto-disable low-stock items
        }));
        this.totalCount = res.result.meta.totalCount;
        this.page = res.result.meta.page;
        this.pageSize = res.result.meta.pageSize;
        console.log(this.inventories, 'abccc');

        console.log(this.inventories, 'iiiiiiiii');
      },
      error: () => {
        this.notificationService.error('Error', 'Failed to load inventory data');
      },
    });
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log('aa', res.result);

        this.productItems = res.result.data.map((val) => ({
          label: val.name,
          value: val.productId,
        }));
      },
      error: () => {
        this.notificationService.error('Error!!', 'Failed to Load Products');
      },
    });
  }

  private loadCategories(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (res) => {
        this.warehouseItems = res.result.map((val) => ({
          label: val.name,
          value: val.warehouseId,
        }));
      },
      error: () => {
        this.notificationService.error('Error!!', 'Failed to Load Products');
      },
    });
  }

  private createEmptyInventory(): InventoryResponse {
    return {
      inventoryId: 0,
      productId: 0,
      productName: '',
      warehouseId: 0,
      warehouseName: '',
      quantity: 0,
      reorderLevel: 0,
      createdbyUserId: 0,
    };
  }
  onToggleChange(inventory: { isDisabled: boolean; inventoryId: number }) {
    if (inventory.isDisabled) {
      console.log(`Inventory ${inventory.inventoryId} is locked (low stock or manually disabled).`);
    } else {
      console.log(`Inventory ${inventory.inventoryId} is unlocked for editing.`);
    }
  }

  onParamsChange(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = first / rows + 1;
    const pageSize = rows;

    const sortColumn = event.sortField;
    const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
    const search = this.inventoriesSearchText ?? '';
    this.loadInventories(page, pageSize, search, sortColumn, sortDirection);
  }
  openNew(): void {
    this.isEditMode = false;
    this.inventory = this.createEmptyInventory();
    this.submitted = false;
    this.inventoryDialog = true;
  }

  editInventory(inventory: InventoryResponse): void {
    this.isEditMode = true;
    this.inventory = { ...inventory };

    this.selectedProducts = this.productItems.find((p) => p.value === inventory.productId) || inventory.productId;
    this.selectedWarehouse =
      this.warehouseItems.find((w) => w.value === inventory.warehouseId) || inventory.warehouseId;

    this.inventoryDialog = true;
  }

  hideDialog(): void {
    this.inventory = this.createEmptyInventory();
    this.inventoryDialog = false;
    this.submitted = false;
  }
  searchInventoryInput(value: string): void {
    this.searchService.setSearchTerm(value);
  }
  searchProduct(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredItems = this.productItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }
  searchWarehouse(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredWarehouseItems = this.warehouseItems.filter((item) => item.label.toLowerCase().includes(query)) ?? [];
  }

  saveInventory(): void {
    this.submitted = true;

    const req = this.makeInventoryRequest();
    const request = this.makeUpdateInventoryRequest();
    console.log(req, 'reqqqq');

    if (this.isEditMode) {
      this.updateInventory(request);
    } else {
      this.createInventory(req);
    }
  }

  private createInventory(req: InventoryRequest): void {
    this.inventoryService.createInventory(req).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Inventory Created Successfully');
        this.hideDialog();
        this.loadInventories(this.page, this.pageSize);
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to Create Inventory');
      },
    });
  }

  private updateInventory(req: InventoryRequest): void {
    this.inventoryService.updateInventory(req, this.inventory.inventoryId).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Inventory Updated Successfully');
        this.hideDialog();
        this.loadInventories(this.page, this.pageSize);
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to Update Inventory');
      },
    });
  }

  exportExcel(): void {
    try {
      this.exportService.exportToExcel(this.inventories as never, {
        fileName: 'Inventory_Report',
        sheetName: 'Inventory Data',
        title: 'The Unity Ware Inventory Excel Report',
      });
      this.notificationService.success('Export', 'Excel Export Completed');
    } catch {
      this.notificationService.error('Export', 'Excel Export Failed');
    }
  }

  private makeInventoryRequest(): InventoryRequest {
    const extractValue = (field: number | { label: string; value: number } | null): number => {
      if (field && typeof field === 'object' && 'value' in field) {
        return field.value;
      }
      return Number(field) || 0;
    };

    return {
      productId: extractValue(this.selectedProducts) || this.inventory.productId,
      warehouseId: extractValue(this.selectedWarehouse) || this.inventory.warehouseId,
      quantity: Number(this.inventory.quantity) || 0,
    };
  }

  private makeUpdateInventoryRequest(): InventoryRequest {
    const extractValue = (field: number | { value: number } | null): number => {
      if (field && typeof field === 'object' && 'value' in field) {
        return field.value;
      }
      return Number(field) || 0;
    };

    return {
      productId: extractValue(this.selectedProducts),
      warehouseId: extractValue(this.selectedWarehouse),
      quantity: Number(this.inventory.quantity) || 0,
    };
  }

  getStatusLabel(qty: number): string {
    return qty > 0 ? 'In Stock' : 'Out of Stock';
  }

  getSeverity(qty: number): 'success' | 'danger' {
    return qty > 0 ? 'success' : 'danger';
  }
}
