import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { NotificationService } from '../../../../core/services/notification.services';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { CategoryRequest, CategoryResponse } from '../../models/category.model';
import { CategoryService } from '../../services/category.services';

interface Category {
  categoryId: number;
  categoryName: string;
  parentCategoryName: string | '';
  parentCategoryId: number;
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
    MetricCardComponent,
  ],
  templateUrl: './category-detail.html',
})
export class CategoryDetail implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private notificationService = inject(NotificationService);
  date: Date | null = null;
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  items: { label: number | null; value: string }[] = [];
  categoryItems: CategoryResponse[] = [];
  parentCategory = '';
  selectedParentCategory: Category | null = null;
  isEditMode = false;

  category: Category = {
    categoryId: 0,
    categoryName: '',
    parentCategoryId: 0,
    parentCategoryName: '',
  };
  categoryDialog = false;
  submitted = false;

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryItems = res.result;
        this.items = res.result.map((val) => ({
          label: val.categoryId,
          value: val.categoryName,
        }));
      },
      error: () => {
        this.notificationService.error('Error', 'Failed to Load Warehouses');
      },
    });
  }

  createEmptyCategory(): Category {
    return {
      categoryId: 0,
      categoryName: '',
      parentCategoryName: '',
      parentCategoryId: 0,
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
    const req: CategoryRequest = this.makeCategoryRequest();
    if (this.isEditMode) {
      this.updateCategory(req);
    } else {
      this.createCategory(req);
    }
  }

  private createCategory(req: CategoryRequest): void {
    const payload = {
      ...req,
      parentCategoryId: req.parentCategoryId === 0 ? null : req.parentCategoryId,
    };
    this.categoryService.createCategory(payload).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Category Created Successfully');
        this.hideDialog();
        this.loadCategories();
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to Create Category');
      },
    });
  }

  private updateCategory(req: CategoryRequest): void {
    this.categoryService.updateCategory(req, this.category.categoryId).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Category Updated Successfully');
        this.hideDialog();
        this.loadCategories();
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to Update Category');
      },
    });
  }

  exportCSV(event?: Event) {
    console.log('Export CSV clicked', event);
    this.notificationService.info('CSV Data Exported');
  }

  private makeCategoryRequest(): CategoryRequest {
    return {
      categoryName: this.category.categoryName,
      parentCategoryId: Number(this.selectedParentCategory),
    };
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }
}
