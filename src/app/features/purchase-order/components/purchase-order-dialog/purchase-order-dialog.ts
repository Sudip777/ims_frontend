import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PurchaseOrder } from '../../models/purchase-order.model';

@Component({
  selector: 'app-purchase-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TableModule,
  ],
  templateUrl: './purchase-order-dialog.html',
})
export class PurchaseOrderDialog {
  @Input() visible = false;
  @Input() purchaseOrder!: PurchaseOrder;
  @Input() statusOptions: { label: string; value: number }[] = [];
  @Output() save = new EventEmitter<PurchaseOrder>();
  @Output() cancel = new EventEmitter<void>();

  addDetail() {
    this.purchaseOrder.purchaseOrderDetails.push({
      purchaseOrderDetailId: Math.floor(Math.random() * 10000),
      productId: 0,
      productName: '',
      quantity: 1,
      unitPrice: 0,
    });
  }

  removeDetail(index: number) {
    this.purchaseOrder.purchaseOrderDetails.splice(index, 1);
  }
}
