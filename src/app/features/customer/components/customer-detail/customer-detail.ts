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
import { NotificationService } from '../../../../core/services/notification.services';
import { ExportService } from '../../../../core/services/export.services';
import { CustomerService } from '../../services/customer.services';

interface CustomerResponse {
  customerId: number;
  name: string;
  email: string;
  phone: number;
  address: string;
  isActive: boolean;
  createdAt: Date;
  createdByUserId: number;
}

type CustomerRequest = Omit<CustomerResponse, 'customerId' | 'createdAt' | 'createdByUserId'>;

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
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
    MetricCardComponent,
  ],
})
export class CustomerDetail {
  // DI
  private readonly customerService = inject(CustomerService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly exportService = inject(ExportService);

  // UI State
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  customers: CustomerResponse[] = [];
  selectedCustomers: CustomerResponse[] = [];
  customerDialog = false;
  submitted = false;
  isEditMode = false;

  // Active Customer Model
  customer: CustomerResponse = {
    customerId: 0,
    name: '',
    email: '',
    phone: 0,
    address: '',
    isActive: true,
    createdAt: new Date(),
    createdByUserId: 0,
  };
  items: any[] = [];

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (res) => {
        this.items = res.result;
        console.log(res.result, 'suppp');
      },
      error: () => {
        this.notificationService.error('Error!!', 'Failed to Load Customers');
      },
    });
  }

  createEmptyCustomer(): CustomerResponse {
    return {
      customerId: 0,
      name: '',
      email: '',
      phone: 0,
      address: '',
      isActive: true,
      createdByUserId: 0,
      createdAt: new Date(),
    };
  }

  openNew(): void {
    this.isEditMode = false;
    this.customer = this.createEmptyCustomer();
    this.submitted = false;
    this.customerDialog = true;
  }

  editCustomer(customer: CustomerResponse): void {
    this.isEditMode = true;
    this.customer = { ...customer };
    this.customerDialog = true;
  }

  hideDialog(): void {
    this.customerDialog = false;
    this.submitted = false;
    this.customer = this.createEmptyCustomer();
  }

  saveCustomer(): void {
    this.submitted = true;

    if (!this.customer.name || !this.customer.phone) {
      this.notificationService.warn('Validation Error', 'Customer name and phone are required');
      return;
    }

    const req = this.makeCustomerRequest();

    if (this.isEditMode) {
      this.updateCustomer(req);
    } else {
      this.createCustomer(req);
    }
  }

  private createCustomer(req: CustomerRequest): void {
    this.customerService.createCustomer(req).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Customer Created Successfully');
        this.hideDialog();
        this.loadCustomers();
      },
      error: (err) => {
        this.notificationService.error(
          'Error!!',
          err.error?.message || 'Failed to Create Customer'
        );
      },
    });
  }

  private updateCustomer(req: CustomerRequest): void {
    this.customerService.updateCustomer(req, this.customer.customerId).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Customer Updated Successfully');
        this.hideDialog();
        this.loadCustomers();
      },
      error: () => {
        this.notificationService.error('Error!!', 'Failed to Update Customer');
      },
    });
  }

  deleteCustomer(customer: CustomerResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${customer.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.customerService.deleteCustomer(customer.customerId).subscribe({
          next: () => {
            this.notificationService.success('Success', 'Customer Deleted Successfully');
            this.loadCustomers();
          },
          error: () => {
            this.notificationService.error('Error!!', 'Failed to Delete Customer');
          },
        });
      },
    });
  }

  deleteSelectedCustomers(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Customers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customers = this.customers.filter((val) => !this.selectedCustomers.includes(val));
        this.selectedCustomers = [];
        this.notificationService.success('Success', 'Customers Deleted Successfully');
      },
    });
  }

  exportExcel(): void {
    try {
      this.exportService.exportToExcel(this.items, {
        fileName: 'Customers_Excel_Report',
        sheetName: 'Customer Data',
        title: 'The Unity Ware Excel Report',
      });
      this.notificationService.success('Export', 'Excel Export Completed');
    } catch {
      this.notificationService.error('Export', 'Excel Export Failed');
    }
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }

  private makeCustomerRequest(): CustomerRequest {
    return {
      name: this.customer.name,
      email: this.customer.email,
      phone: this.customer.phone,
      address: this.customer.address,
      isActive: this.customer.isActive,
    };
  }
}
