import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'lightBlue'
  | 'blue'
  | 'skyBlue'
  | 'success'
  | 'babyBlue'
  | 'lightRed'
  | 'neutral';

export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() color: ButtonColor = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() className = '';
  @Input() prefix?: string;
  @Input() postfix?: string;
  @Input() rounded = true; // ✅ new
  @Input() ariaLabel?: string; // ✅ accessibility

  @Output() buttonClick = new EventEmitter<Event>();

  // Base styles
  private readonly baseStyles =
    'inline-flex items-center justify-center gap-3 font-semibold transition-all duration-300 ease-in-out border-0 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  // Color variants
  private readonly colorStyles: Record<ButtonColor, string> = {
    primary:
      'bg-[#6941C6] text-white shadow-[0_10px_40px_rgba(105,65,198,0.3)] hover:shadow-[0_15px_50px_rgba(105,65,198,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(105,65,198,0.3)]',
    secondary:
      'bg-[#1D4ED8] text-white shadow-[0_10px_40px_rgba(29,78,216,0.3)] hover:shadow-[0_15px_50px_rgba(29,78,216,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(29,78,216,0.3)]',
    destructive:
      'bg-[#EF4444] text-white shadow-[0_10px_40px_rgba(239,68,68,0.3)] hover:shadow-[0_15px_50px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(239,68,68,0.3)]',
    success:
      'bg-[#10B981] text-white shadow-[0_10px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(16,185,129,0.3)]',
    lightBlue:
      'bg-[#38BDF8] text-white shadow-[0_10px_40px_rgba(56,189,248,0.3)] hover:shadow-[0_15px_50px_rgba(56,189,248,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(56,189,248,0.3)]',
    blue: 'bg-[#3B82F6] text-white shadow-[0_10px_40px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_50px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(59,130,246,0.3)]',
    skyBlue:
      'bg-[#0EA5E9] text-white shadow-[0_10px_40px_rgba(14,165,233,0.3)] hover:shadow-[0_15px_50px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(14,165,233,0.3)]',
    babyBlue:
      'bg-[#7DD3FC] text-gray-900 shadow-[0_10px_40px_rgba(125,211,252,0.3)] hover:shadow-[0_15px_50px_rgba(125,211,252,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(125,211,252,0.3)]',
    lightRed:
      'bg-[#FCA5A5] text-gray-900 shadow-[0_10px_40px_rgba(252,165,165,0.3)] hover:shadow-[0_15px_50px_rgba(252,165,165,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(252,165,165,0.3)]',
    neutral:
      'bg-[#6B7280] text-white shadow-[0_10px_40px_rgba(107,114,128,0.3)] hover:shadow-[0_15px_50px_rgba(107,114,128,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_30px_rgba(107,114,128,0.3)]',
  };

  private readonly sizeStyles: Record<ButtonSize, string> = {
    sm: 'py-2 px-6 text-sm',
    md: 'py-3 px-8 text-base',
    lg: 'py-4 px-10 text-xl',
  };

  get buttonClasses(): string {
    const widthClass = this.fullWidth ? 'w-full block' : '';
    const shapeClass = this.rounded ? 'rounded-full' : 'rounded-none';
    return `${this.baseStyles} ${this.colorStyles[this.color]} ${
      this.sizeStyles[this.size]
    } ${shapeClass} ${widthClass} ${this.className}`.trim();
  }

  onClick(event: Event): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }

  // ✅ Forward external classes to the host
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return this.disabled;
  }
  @HostBinding('attr.aria-label') get ariaLabelValue() {
    return this.ariaLabel || null;
  }
}
