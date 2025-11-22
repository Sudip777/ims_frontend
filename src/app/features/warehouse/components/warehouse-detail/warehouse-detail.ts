import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { ExportService } from '../../../../core/services/export.services';
import { NotificationService } from '../../../../core/services/notification.services';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { WarehouseService } from '../../services/warehouse.services';

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
})
export class WarehouseDetail implements OnInit {
  private readonly warehouseService = inject(WarehouseService);
  private readonly notificationService = inject(NotificationService);
  private readonly exportService = inject(ExportService);

  warehouses: Warehouse[] = [];
  selectedWarehouses: Warehouse[] = [];
  warehouseDialog = false;
  submitted = false;
  isEditMode = false;
  tableLoading = false;

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

  exportExcel(): void {
    try {
      this.exportService.exportToExcel(this.warehouses as never, {
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
