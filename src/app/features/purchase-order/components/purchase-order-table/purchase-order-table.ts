import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PurchaseOrder } from '../../models/purchase-order.model';

@Component({
  selector: 'app-purchase-order-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ToggleSwitchModule,
  ],
  templateUrl: './purchase-order-table.html',
})
export class PurchaseOrderTable {
  @Input() purchaseOrders: PurchaseOrder[] = [];
  @Input() expandedRows: { [key: number]: boolean } = {};

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<PurchaseOrder>();
  @Output() delete = new EventEmitter<PurchaseOrder>();
  @Output() export = new EventEmitter<void>();
  @Output() rowExpand = new EventEmitter<PurchaseOrder>();
  @Output() rowCollapse = new EventEmitter<PurchaseOrder>();

  @ViewChild('dt') table!: Table;

  handleRowExpand(event: { data: PurchaseOrder }) {
    this.rowExpand.emit(event.data);
  }

  handleRowCollapse(event: { data: PurchaseOrder }) {
    this.rowCollapse.emit(event.data);
  }
}
