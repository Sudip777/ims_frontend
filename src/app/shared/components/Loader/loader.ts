import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    @if(loading$ | async){

    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
      <div class="flex flex-col items-center space-y-3">
        <p-progress-spinner
          strokeWidth="4"
          fill="transparent"
          animationDuration=".5s"
          [style]="{ width: '100px', height: '100px' }"></p-progress-spinner>
        <div class="flex items-center space-x-1">
          <p class="text-2xl font-semibold font-heading text-ims-text-primary">Loading, please wait</p>
          <span class="text-xl font-semibold text-ims-text-primary animate-dotBounce [animation-delay:0s]">.</span>
          <span class="text-xl font-semibold text-ims-text-primary animate-dotBounce [animation-delay:0.2s]">.</span>
          <span class="text-xl font-semibold text-ims-text-primary animate-dotBounce [animation-delay:0.4s]">.</span>
        </div>
      </div>
    </div>
    }
  `,
})
export class Loader {
  private loader = inject(LoadingService);
  loading$ = this.loader.loading$;
}
