import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { WarehouseService } from '../../services/warehouse.services';
import { NotificationService } from '../../../../core/services/notification.services';
import { ExportService } from '../../../../core/services/export.services';

interface Warehouse {
  warehouseId: number;
  name: string;
  createdByUserId: number;
}

type WarehouseRequest = Omit<Warehouse, 'warehouseId' | 'createdByUserId'>;

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    ToastModule,
    FileUploadModule,
    RadioButtonModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
    TagModule,
    MetricCardComponent,
  ],
  templateUrl: './warehouse-detail.html',
  // styleUrl: './warehouse-detail.scss',
})
export class WarehouseDetail {
  private readonly warehouseService = inject(WarehouseService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly exportService = inject(ExportService);

  warehouses: Warehouse[] = [];
  selectedWarehouses: Warehouse[] = [];
  warehouseDialog = false;
  submitted = false;
  isEditMode = false;

  warehouse: Warehouse = {
    warehouseId: 0,
    name: '',
    createdByUserId: 0,
  };

  ngOnInit(): void {
    this.loadWarehouses();
  }

  private loadWarehouses(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (res) => {
        this.warehouses = res.result;
      },
      error: () => {
        this.notificationService.error('Error', 'Failed to Load Warehouses');
      },
    });
  }

  createEmptyWarehouse(): Warehouse {
    return {
      warehouseId: 0,
      name: '',
      createdByUserId: 0,
    };
  }

  openNew(): void {
    this.isEditMode = false;
    this.warehouse = this.createEmptyWarehouse();
    this.submitted = false;
    this.warehouseDialog = true;
  }

  editWarehouse(warehouse: Warehouse): void {
    this.isEditMode = true;
    this.warehouse = { ...warehouse };
    this.warehouseDialog = true;
  }

  hideDialog(): void {
    this.warehouseDialog = false;
    this.submitted = false;
    this.warehouse = this.createEmptyWarehouse();
  }

  saveWarehouse(): void {
    this.submitted = true;

    if (!this.warehouse.name) {
      this.notificationService.warn('Validation Error', 'Warehouse name is required');
      return;
    }

    const req: WarehouseRequest = this.makeWarehouseRequest();

    if (this.isEditMode) {
      this.updateWarehouse(req);
    } else {
      this.createWarehouse(req);
    }
  }

  private createWarehouse(req: WarehouseRequest): void {
    this.warehouseService.createWarehouse(req).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Warehouse Created Successfully');
        this.hideDialog();
        this.loadWarehouses();
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to Create Warehouse');
      },
    });
  }

  private updateWarehouse(req: WarehouseRequest): void {
    this.warehouseService.updateWarehouse(req, this.warehouse.warehouseId).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Warehouse Updated Successfully');
        this.hideDialog();
        this.loadWarehouses();
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to Update Warehouse');
      },
    });
  }

  // deleteWarehouse(warehouse: Warehouse): void {
  //   this.confirmationService.confirm({
  //     message: `Are you sure you want to delete "${warehouse.name}"?`,
  //     header: 'Confirm Deletion',
  // icon: 'pi pi-exclamation-triangle',
  // acceptLabel: 'Confirm',
  // rejectLabel: 'Cancel',
  // rejectButtonStyleClass: 'p-button-secondary',
  // acceptButtonStyleClass: 'p-button-danger',
  //     accept: () => {
  //       this.warehouseService.deleteWarehouse(warehouse.warehouseId).subscribe({
  //         next: () => {
  //           this.notificationService.success('Success', 'Warehouse Deleted Successfully');
  //           this.loadWarehouses();
  //         },
  //         error: () => {
  //           this.notificationService.error('Error', 'Failed to Delete Warehouse');
  //         },
  //       });
  //     },
  //   });
  // }

  // deleteSelectedWarehouses(): void {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected Warehouses?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.warehouses = this.warehouses.filter((val) => !this.selectedWarehouses.includes(val));
  //       this.selectedWarehouses = [];
  //       this.notificationService.success('Success', 'Selected Warehouses Deleted');
  //     },
  //   });
  // }

  exportExcel(): void {
    try {
      this.exportService.exportToExcel(this.warehouses, {
        fileName: 'Warehouses_Excel_Report',
        sheetName: 'Warehouse Data',
        title: 'The Unity Ware Excel Report',
      });
      this.notificationService.success('Export', 'Excel Export Completed');
    } catch {
      this.notificationService.error('Export', 'Excel Export Failed');
    }
  }

  private makeWarehouseRequest(): WarehouseRequest {
    return {
      name: this.warehouse.name,
    };
  }
}
