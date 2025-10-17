import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { ConfirmationService, MessageService } from 'primeng/api';
interface Warehouse {
  warehouseId: number;
  name: string;
  createdBy: string;
}
@Component({
  selector: 'app-warehouse-detail',
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
  templateUrl: './warehouse-detail.html',
  styleUrl: './warehouse-detail.scss',
})
export class WarehouseDetail {
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  warehouses: Warehouse[] = [];
  selectedWarehouses: Warehouse[] = [];

  warehouse: Warehouse = {
    warehouseId: 0,
    name: '',
    createdBy: '',
  };
  warehouseDialog = false;
  submitted = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.warehouses = [
      {
        warehouseId: 1,
        name: 'Kathmandu Central Warehouse',
        createdBy: 'Admin - Bikash Shrestha',
      },
      {
        warehouseId: 2,
        name: 'Pokhara Lakeside Storage',
        createdBy: 'Admin - Anisha Gurung',
      },
      {
        warehouseId: 3,
        name: 'Biratnagar Distribution Hub',
        createdBy: 'System - Deepak Rai',
      },
      {
        warehouseId: 4,
        name: 'Chitwan Agro Supplies Depot',
        createdBy: 'Admin - Pramila Thapa',
      },
      {
        warehouseId: 5,
        name: 'Lalitpur Electronics Hub',
        createdBy: 'System - Roshan Maharjan',
      },
      {
        warehouseId: 6,
        name: 'Butwal Home Essentials Warehouse',
        createdBy: 'Admin - Sabina KC',
      },
      {
        warehouseId: 7,
        name: 'Dharan Fashion Storage',
        createdBy: 'Admin - Kishor Limbu',
      },
      {
        warehouseId: 8,
        name: 'Janakpur FMCG Warehouse',
        createdBy: 'System - Manju Yadav',
      },
      {
        warehouseId: 9,
        name: 'Hetauda Furniture & Fixtures Depot',
        createdBy: 'Admin - Ramesh Tamang',
      },
      {
        warehouseId: 10,
        name: 'Nepalgunj Automotive Parts Storage',
        createdBy: 'Admin - Suresh Chaudhary',
      },
      {
        warehouseId: 11,
        name: 'Bhaktapur Handicrafts Warehouse',
        createdBy: 'System - Kiran Manandhar',
      },
    ];
  }

  createEmptyWarehouse(): Warehouse {
    return {
      warehouseId: 0,
      name: '',
      createdBy: '',
    };
  }
  openNew() {
    this.warehouse = this.createEmptyWarehouse();
    this.submitted = false;
    this.warehouseDialog = true;
  }

  hideDialog() {
    this.warehouseDialog = false;
    this.submitted = false;
  }

  saveWarehouse() {
    this.submitted = true;

    if (this.warehouse.name.trim()) {
      if (this.warehouse.warehouseId) {
        const index = this.findIndexById(this.warehouse.warehouseId);
        if (index !== -1) this.warehouses[index] = this.warehouse;

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'warehouse Updated',
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'warehouse Created',
          life: 3000,
        });
      }

      this.warehouses = [...this.warehouses];
      this.warehouseDialog = false;
      this.warehouse = this.createEmptyWarehouse();
    }
  }

  editWarehouse(warehouse: Warehouse) {
    this.warehouse = { ...warehouse };
    this.warehouseDialog = true;
  }

  deleteWarehouse(warehouse: Warehouse) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${warehouse.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.warehouses = this.warehouses.filter((p) => p.warehouseId !== warehouse.warehouseId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Warehouse Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteSelectedWarehouses() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Warehouses?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.warehouses = this.warehouses.filter((val) => !this.selectedWarehouses.includes(val));
        this.selectedWarehouses = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Suppliers Deleted',
          life: 3000,
        });
      },
    });
  }

  exportCSV(event?: Event) {
    console.log('Export CSV clicked', event);
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'CSV Export started...',
      life: 3000,
    });
  }

  findIndexById(id: number): number {
    return this.warehouses.findIndex((p) => p.warehouseId === id);
  }

  createId(): number {
    return Math.floor(Math.random() * 10000) + 100;
  }
}
