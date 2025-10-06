import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.html',
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() percentage: number = 0;
  @Input() trend: 'up' | 'down' = 'up';
  @Input() chartPath: string = 'M 0 32 Q 32 48 64 32 T 128 16';
  @Input() isPrimary: boolean = false;
}
