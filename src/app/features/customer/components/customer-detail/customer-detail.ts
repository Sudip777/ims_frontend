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
interface Customer {
  CustomerId: number;
  Name: string;
  Email: string;
  Phone: number | string;
  Address: string;
  Status: boolean;
  CreatedAt: Date;
  CreatedByUserId: number;
}
@Component({
  selector: 'app-customer-detail',
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
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail {
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  customers: Customer[] = [];
  selectedCustomers: Customer[] = [];

  customer: Customer = {
    CustomerId: 0,
    Name: '',
    Email: '',
    Phone: '',
    Address: '',
    Status: true,
    CreatedAt: new Date(),
    CreatedByUserId: 0,
  };
  customerDialog = false;
  submitted = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Customer data
    this.customers = [
      {
        CustomerId: 1,
        Name: 'John Doe',
        Email: 'john.doe@example.com',
        Phone: '9876543210',
        Address: '123 Main Street, New York, NY',
        Status: true,
        CreatedAt: new Date('2024-01-15'),
        CreatedByUserId: 101,
      },
      {
        CustomerId: 2,
        Name: 'Jane Smith',
        Email: 'jane.smith@example.com',
        Phone: '9876501234',
        Address: '456 Oak Avenue, Los Angeles, CA',
        Status: true,
        CreatedAt: new Date('2024-02-20'),
        CreatedByUserId: 102,
      },
      {
        CustomerId: 3,
        Name: 'Robert Johnson',
        Email: 'robert.johnson@example.com',
        Phone: 9988776655,
        Address: '789 Pine Road, Chicago, IL',
        Status: false,
        CreatedAt: new Date('2024-03-05'),
        CreatedByUserId: 103,
      },
      {
        CustomerId: 4,
        Name: 'Emily Davis',
        Email: 'emily.davis@example.com',
        Phone: '9123456789',
        Address: '321 Maple Blvd, Houston, TX',
        Status: true,
        CreatedAt: new Date('2024-03-18'),
        CreatedByUserId: 104,
      },
      {
        CustomerId: 5,
        Name: 'Michael Brown',
        Email: 'michael.brown@example.com',
        Phone: '9876012345',
        Address: '654 Elm Street, Phoenix, AZ',
        Status: false,
        CreatedAt: new Date('2024-04-10'),
        CreatedByUserId: 105,
      },
      {
        CustomerId: 6,
        Name: 'Olivia Wilson',
        Email: 'olivia.wilson@example.com',
        Phone: 9001122334,
        Address: '987 Birch Lane, Philadelphia, PA',
        Status: true,
        CreatedAt: new Date('2024-05-01'),
        CreatedByUserId: 106,
      },
      {
        CustomerId: 7,
        Name: 'William Martinez',
        Email: 'william.martinez@example.com',
        Phone: '9012233445',
        Address: '222 Cedar Drive, San Antonio, TX',
        Status: true,
        CreatedAt: new Date('2024-06-12'),
        CreatedByUserId: 107,
      },
      {
        CustomerId: 8,
        Name: 'Sophia Anderson',
        Email: 'sophia.anderson@example.com',
        Phone: 9023344556,
        Address: '111 Spruce Court, San Diego, CA',
        Status: false,
        CreatedAt: new Date('2024-07-25'),
        CreatedByUserId: 108,
      },
      {
        CustomerId: 9,
        Name: 'James Thomas',
        Email: 'james.thomas@example.com',
        Phone: '9234567890',
        Address: '777 Willow Way, Dallas, TX',
        Status: true,
        CreatedAt: new Date('2024-08-19'),
        CreatedByUserId: 109,
      },
      {
        CustomerId: 10,
        Name: 'Ava Taylor',
        Email: 'ava.taylor@example.com',
        Phone: '9345678901',
        Address: '888 Aspen Street, San Jose, CA',
        Status: true,
        CreatedAt: new Date('2024-09-03'),
        CreatedByUserId: 110,
      },
      {
        CustomerId: 11,
        Name: 'Daniel Harris',
        Email: 'daniel.harris@example.com',
        Phone: 9456789012,
        Address: '999 Redwood Ave, Austin, TX',
        Status: false,
        CreatedAt: new Date('2024-09-27'),
        CreatedByUserId: 111,
      },
    ];
  }

  createEmptyCustomer(): Customer {
    return {
      CustomerId: 0,
      Name: '',
      Email: '',
      Phone: '',
      Address: '',
      Status: true,
      CreatedAt: new Date(),
      CreatedByUserId: 0,
    };
  }
  openNew() {
    this.customer = this.createEmptyCustomer();
    this.submitted = false;
    this.customerDialog = true;
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted = false;
  }

  saveCustomer() {
    this.submitted = true;

    if (this.customer.Name.trim()) {
      if (this.customer.CustomerId) {
        const index = this.findIndexById(this.customer.CustomerId);
        if (index !== -1) this.customers[index] = this.customer;

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Customer Updated',
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

      this.customers = [...this.customers];
      this.customerDialog = false;
      this.customer = this.createEmptyCustomer();
    }
  }

  editCustomer(customer: Customer) {
    this.customer = { ...customer };
    this.customerDialog = true;
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${customer.Name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customers = this.customers.filter((p) => p.CustomerId !== customer.CustomerId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Customer Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteSelectedCustomers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Suppliers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customers = this.customers.filter((val) => !this.selectedCustomers.includes(val));
        this.selectedCustomers = [];
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
    return this.customers.findIndex((p) => p.CustomerId === id);
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
