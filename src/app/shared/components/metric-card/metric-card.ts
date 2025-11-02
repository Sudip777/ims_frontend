import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.html',
})
export class MetricCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() percentage = 0;
  @Input() trend: 'up' | 'down' = 'up';
  @Input() chartPath = 'M 0 32 Q 32 48 64 32 T 128 16';
  @Input() isPrimary = false;

  // Unique
  @Input() gradientId: string = Math.random().toString(36).substr(2, 9);
  // safe gradient URL
  getGradientUrl(): string {
    return `url(#gradient-${this.gradientId})`;
  }
}
