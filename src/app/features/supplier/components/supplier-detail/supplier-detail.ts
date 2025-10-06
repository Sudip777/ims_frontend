import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Supplier data
    this.suppliers = [
      {
        supplierId: 1,
        name: 'Himalayan Traders Pvt. Ltd.',
        email: 'info@himalayantraders.com.np',
        phone: '+977-1-4423456',
        address: 'Thamel, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-01-15T10:30:00Z',
        createdByUserId: 10,
      },
      {
        supplierId: 2,
        name: 'Nepal Electronics Supply',
        email: 'sales@nepelectronics.com',
        phone: '+977-1-4567890',
        address: 'New Road, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-02-20T14:15:00Z',
        createdByUserId: 11,
      },
      {
        supplierId: 3,
        name: 'Kathmandu Wholesale Hub',
        email: 'contact@ktmwholesale.com.np',
        phone: '+977-1-4312567',
        address: 'Baneshwor, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-03-10T09:45:00Z',
        createdByUserId: 12,
      },
      {
        supplierId: 4,
        name: 'Mountain Gear Suppliers',
        email: 'info@mountaingear.com.np',
        phone: '+977-1-4678901',
        address: 'Lazimpat, Kathmandu, Nepal',
        isActive: false,
        createdAt: '2025-04-05T11:20:00Z',
        createdByUserId: 10,
      },
      {
        supplierId: 5,
        name: 'Bagmati Trading Company',
        email: 'bagmati@trading.com.np',
        phone: '+977-1-4234567',
        address: 'Tripureshwor, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-05-12T16:30:00Z',
        createdByUserId: 11,
      },
      {
        supplierId: 6,
        name: 'Yeti Imports & Exports',
        email: 'yeti@imports.com.np',
        phone: '+977-1-4445678',
        address: 'Durbarmarg, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-06-18T08:50:00Z',
        createdByUserId: 12,
      },
      {
        supplierId: 7,
        name: 'Everest Food Suppliers',
        email: 'contact@everestfoods.com.np',
        phone: '+977-1-4411223',
        address: 'Putalisadak, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-09-27T17:48:08Z',
        createdByUserId: 12,
      },
      {
        supplierId: 8,
        name: 'Patan Industrial Supply',
        email: 'info@patansupply.com.np',
        phone: '+977-1-5521345',
        address: 'Pulchowk, Lalitpur, Nepal',
        isActive: true,
        createdAt: '2025-07-22T13:15:00Z',
        createdByUserId: 10,
      },
      {
        supplierId: 9,
        name: 'Bhaktapur Handicrafts Co.',
        email: 'handicrafts@bhaktapur.com.np',
        phone: '+977-1-6612345',
        address: 'Durbar Square, Bhaktapur, Nepal',
        isActive: false,
        createdAt: '2025-08-08T10:00:00Z',
        createdByUserId: 11,
      },
      {
        supplierId: 10,
        name: 'Sunrise General Store',
        email: 'sunrise@general.com.np',
        phone: '+977-1-4789012',
        address: 'Chabahil, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-08-30T15:40:00Z',
        createdByUserId: 12,
      },
      {
        supplierId: 11,
        name: 'Annapurna Distribution Ltd.',
        email: 'distribution@annapurna.com.np',
        phone: '+977-1-4890123',
        address: 'Kamaladi, Kathmandu, Nepal',
        isActive: true,
        createdAt: '2025-09-15T12:25:00Z',
        createdByUserId: 10,
      },
    ];
  }
  // 🟢 Utility to create a new blank product
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
  // 🟢 Open dialog for new product
  openNew() {
    this.supplier = this.createEmptySupplier();
    this.submitted = false;
    this.supplierDialog = true;
  }

  // 🟢 Hide dialog
  hideDialog() {
    this.supplierDialog = false;
    this.submitted = false;
  }

  // 🟢 Save (Create or Update)
  saveSupplier() {
    this.submitted = true;

    if (this.supplier.name.trim()) {
      if (this.supplier.supplierId) {
        // Update existing
        const index = this.findIndexById(this.supplier.supplierId);
        if (index !== -1) this.suppliers[index] = this.supplier;

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Supplier Updated',
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Supplier Created',
          life: 3000,
        });
      }

      this.suppliers = [...this.suppliers];
      this.supplierDialog = false;
      this.supplier = this.createEmptySupplier();
    }
  }

  // 🟢 Edit
  editSupplier(supplier: Supplier) {
    this.supplier = { ...supplier };
    this.supplierDialog = true;
  }

  // 🟢 Delete single
  deleteSupplier(supplier: Supplier) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${supplier.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.suppliers = this.suppliers.filter((p) => p.supplierId !== supplier.supplierId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Supplier Deleted',
          life: 3000,
        });
      },
    });
  }

  // 🟢 Delete multiple
  deleteSelectedSuppliers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Suppliers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.suppliers = this.suppliers.filter((val) => !this.selectedSupplierss.includes(val));
        this.selectedSupplierss = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Suppliers Deleted',
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
    return this.suppliers.findIndex((p) => p.supplierId === id);
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
