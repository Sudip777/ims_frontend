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
interface Category {
  categoryId: number;
  categoryName: string;
  parentCategoryName: string | '';
}
@Component({
  selector: 'app-category-detail',
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

    // Custom
    MetricCardComponent,
  ],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetail {
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  categories: Category[] = [];
  selectedCategories: Category[] = [];

  category: Category = {
    categoryId: 0,
    categoryName: '',
    parentCategoryName: '',
  };
  categoryDialog = false;
  submitted = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.categories = [
      {
        categoryId: 1,
        categoryName: 'Electronics',
        parentCategoryName: 'Products',
      },
      {
        categoryId: 2,
        categoryName: 'Home Appliances',
        parentCategoryName: 'Electronics',
      },
      {
        categoryId: 3,
        categoryName: 'Groceries',
        parentCategoryName: 'Products',
      },
      {
        categoryId: 4,
        categoryName: 'Beverages',
        parentCategoryName: 'Groceries',
      },
      {
        categoryId: 5,
        categoryName: 'Stationery',
        parentCategoryName: 'Office Supplies',
      },
      {
        categoryId: 6,
        categoryName: 'Furniture',
        parentCategoryName: 'Office Supplies',
      },
      {
        categoryId: 7,
        categoryName: 'Clothing',
        parentCategoryName: 'Fashion',
      },
      {
        categoryId: 8,
        categoryName: 'Footwear',
        parentCategoryName: 'Fashion',
      },
      {
        categoryId: 9,
        categoryName: 'Sports Equipment',
        parentCategoryName: 'Outdoor & Fitness',
      },
      {
        categoryId: 10,
        categoryName: 'Health & Beauty',
        parentCategoryName: 'Personal Care',
      },
      {
        categoryId: 11,
        categoryName: 'Automotive Accessories',
        parentCategoryName: 'Vehicles',
      },
    ];
  }

  createEmptyCategory(): Category {
    return {
      categoryId: 0,
      categoryName: '',
      parentCategoryName: '',
    };
  }
  openNew() {
    this.category = this.createEmptyCategory();
    this.submitted = false;
    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  saveCategory() {
    this.submitted = true;

    if (this.category.categoryName.trim()) {
      if (this.category.categoryId) {
        const index = this.findIndexById(this.category.categoryId);
        if (index !== -1) this.categories[index] = this.category;

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Category Updated',
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

      this.categories = [...this.categories];
      this.categoryDialog = false;
      this.category = this.createEmptyCategory();
    }
  }

  editCategory(category: Category) {
    this.category = { ...category };
    this.categoryDialog = true;
  }

  deleteCategory(category: Category) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${category.categoryName}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.categories = this.categories.filter((p) => p.categoryId !== category.categoryId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Supplier Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteSelectedCategories() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Suppliers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categories = this.categories.filter((val) => !this.selectedCategories.includes(val));
        this.selectedCategories = [];
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
    return this.categories.findIndex((p) => p.categoryId === id);
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
