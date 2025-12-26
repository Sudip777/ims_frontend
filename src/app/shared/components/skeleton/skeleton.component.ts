import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  imports: [CommonModule],
})
export class SkeletonComponent implements OnInit {
  @Input() type: 'sidebar' | 'table' | 'card' | 'text' | 'avatar' | 'button' =
    'text';
  @Input() width?: string;
  @Input() height?: string;
  @Input() borderRadius?: string = '0.5rem';
  @Input() animation?: 'wave' | 'pulse' | 'none' = 'wave';
  @Input() count = 1;
  @Input() customClass = '';
  @Input() style?: Record<string, string | number>;

  // For table skeleton
  @Input() tableColumnsCount = 5;
  @Input() tableRowsCount = 5;

  // For sidebar skeleton
  @Input() menuItemsCount = 6;

  skeletonItems: number[] = [];
  tableColumns: number[] = [];
  tableRows: number[] = [];
  menuItems: number[] = [];

  ngOnInit() {
    // Initialize arrays based on count inputs
    this.skeletonItems = Array(this.count).fill(0);
    this.tableColumns = Array(this.tableColumnsCount).fill(0);
    this.tableRows = Array(this.tableRowsCount).fill(0);
    this.menuItems = Array(this.menuItemsCount).fill(0);
  }

  getClassNames(): string {
    let classes = 'skeleton ';

    // Add type-specific classes
    switch (this.type) {
      case 'sidebar':
        classes += 'skeleton-sidebar ';
        break;
      case 'table':
        classes += 'skeleton-table ';
        break;
      case 'card':
        classes += 'skeleton-card ';
        break;
      case 'avatar':
        classes += 'skeleton-avatar ';
        break;
      case 'button':
        classes += 'skeleton-button ';
        break;
      default:
        classes += 'skeleton-text ';
        break;
    }

    // Add animation class
    if (this.animation === 'wave') {
      classes += 'skeleton-animation-wave ';
    } else if (this.animation === 'pulse') {
      classes += 'skeleton-animation-pulse ';
    }

    return classes;
  }

  getStyleObject(): Record<string, string | number> {
    const styleObj: Record<string, string | number> = {};

    if (this.width) styleObj['width'] = this.width;
    if (this.height) styleObj['height'] = this.height;
    if (this.borderRadius) styleObj['borderRadius'] = this.borderRadius;

    return { ...styleObj, ...this.style };
  }

  trackByIndex(index: number): number {
    return index;
  }
}
