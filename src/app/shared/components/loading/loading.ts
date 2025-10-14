import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../../core/services/loading';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div
      *ngIf="loadingService.loading$ | async"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <p-progressSpinner></p-progressSpinner>
    </div>
  `,
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
