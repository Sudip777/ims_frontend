// import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

// @Directive({
//   selector: '[responsiveDialog]',
//   standalone: true,
// })
// export class ResponsiveDialogDirective implements OnInit {
//   @Input() smallWidth = '90vw';
//   @Input() mediumWidth = '600px';
//   @Input() defaultWidth = '800px';

//   @Input() smallHeight = '90vh';
//   @Input() mediumHeight = '70vh';
//   @Input() defaultHeight = '600px';

//   private resizeTimeout: number | undefined;

//   constructor(private el: ElementRef) {}

//   ngOnInit(): void {
//     this.updateDimensions();
//     console.log('directive init');
//   }

//   // Listen to window resize
//   @HostListener('window:resize')
//   onResize(): void {
//     this.debounceUpdate();
//   }

//   private debounceUpdate(): void {
//     clearTimeout(this.resizeTimeout);
//     this.resizeTimeout = setTimeout(() => this.updateDimensions(), 100); // 100ms debounce
//   }

//   private updateDimensions(): void {
//     const width = this.calculateWidth();
//     const height = this.calculateHeight();

//     const elStyle = this.el.nativeElement.style;
//     elStyle.width = width;
//     elStyle.height = height;
//   }

//   private calculateWidth(): string {
//     const screenWidth = window.innerWidth;

//     switch (true) {
//       case screenWidth < 425:
//         return this.smallWidth;
//       case screenWidth < 768:
//         return this.mediumWidth;
//       default:
//         return this.defaultWidth;
//     }
//   }

//   private calculateHeight(): string {
//     const screenWidth = window.innerWidth;

//     switch (true) {
//       case screenWidth < 425:
//         return this.smallHeight;
//       case screenWidth < 768:
//         return this.mediumHeight;
//       default:
//         return this.defaultHeight;
//     }
//   }
// }
