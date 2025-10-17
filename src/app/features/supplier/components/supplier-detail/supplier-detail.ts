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
import { SupplierService } from '../../services/supplier.services';
import { NotificationService } from '../../../../core/services/notification.services';
import { saveAs } from 'file-saver';
import { ExportService } from '../../../../core/services/export.services';

interface Supplier {
  supplierId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  createdByUserId: number;
}
@Component({
  selector: 'app-supplier-detail',
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
  standalone: true,
  templateUrl: './supplier-detail.html',
  styleUrl: './supplier-detail.scss',
})
export class SupplierDetail {
  //DI
  private readonly supplierService = inject(SupplierService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly exportService = inject(ExportService);

  // input properties same as props in React
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  suppliers: Supplier[] = [];
  selectedSupplierss: Supplier[] = [];
  supplier: Supplier = {
    supplierId: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
    createdAt: '',
    createdByUserId: 0,
  };
  supplierDialog = false;
  submitted = false;
  isEditMode = false;
  items: any[] = [];

  // Runs once after Angular has initialized all the component's inputs
  ngOnInit(): void {
    this.loadSuppliers();
  }

  private loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (res) => {
        this.items = res.result;
        console.log(res.result, 'suppp');
      },
      error: () => {
        this.notificationService.error('Error!!', 'Failed to Load Suppliers');
      },
    });
  }
  createEmptySupplier(): Supplier {
    return {
      supplierId: 0,
      name: '',
      email: '',
      phone: '',
      address: '',
      isActive: true,
      createdByUserId: 0,
      createdAt: new Date().toISOString(),
    };
  }

  openNew(): void {
    this.isEditMode = false;
    this.supplier = this.createEmptySupplier();
    this.submitted = false;
    this.supplierDialog = true;
  }
  editSupplier(supplier: Supplier) {
    this.isEditMode = true;
    this.supplier = { ...supplier };
    this.supplierDialog = true;
  }

  hideDialog(): void {
    this.supplier = this.createEmptySupplier();
    this.supplierDialog = false;
    this.submitted = false;
  }

  saveSupplier() {
    this.submitted = true;

    if (!this.supplier.name || !this.supplier.phone || !this.supplier.email) {
      this.notificationService.warn(
        'Validation Error',
        'Supplier Name, Phone and Email are required'
      );
      return;
    }

    const req = this.makeProductRequest();

    if (this.isEditMode) {
      this.updateSupplier(req);
    } else {
      this.createSupplier(req);
    }
  }

  private createSupplier(req: SupplierRequest): void {
    this.supplierService.createSupplier(req).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Supplier Created Successfully');
        this.hideDialog();
        this.loadSuppliers();
      },
      error: (err) => {
        this.notificationService.error(
          'Error!!',
          err.error?.message || 'Failed to Create Supplier'
        );
      },
    });
  }

  private updateSupplier(req: SupplierRequest): void {
    this.supplierService.updateSupplier(this.supplier.supplierId, req).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Supplier Updated Successfully');
        this.hideDialog();
        this.loadSuppliers();
      },
    });
  }

  deleteSupplier(supplier: Supplier) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${supplier.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.supplierService.deleteSupplier(supplier.supplierId).subscribe({
          next: () => {
            this.notificationService.success('Success', 'Supplier Deleted Successfully');
            this.loadSuppliers();
          },
          error: (): void => {
            this.notificationService.error('Error!!', 'Failed to Delete Supplier');
          },
        });
      },
    });
  }

  deleteSelectedSuppliers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Suppliers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.suppliers = this.suppliers.filter((val) => !this.selectedSupplierss.includes(val));
        this.selectedSupplierss = [];
        this.notificationService.success('Success', 'Supplier Deleted Successfully');
      },
    });
  }
  exportExcel() {
    try {
      this.exportService.exportToExcel(this.items, {
        fileName: 'Suppliers_Excel_Report',
        sheetName: 'Supplier Data',
        title: 'The Unity Ware Excel Report',
      });

      this.notificationService.success('Export', 'Excel Export Completed');
    } catch (error) {
      this.notificationService.error('Export', 'Excel Export Failed');
    }
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }

  private makeProductRequest(): SupplierRequest {
    return {
      name: this.supplier.name,
      email: this.supplier.email,
      phone: this.supplier.phone,
      address: this.supplier.address,
      isActive: this.supplier.isActive,
    };
  }
}
