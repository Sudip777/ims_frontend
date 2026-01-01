import { Component, inject, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../services/icon.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() name!: string;
  @Input() width?: string;
  @Input() height?: string;
  @Input() color?: string;

  svg: SafeHtml = '';

  private iconService = inject(IconService);

  ngOnInit() {
    if (this.name) {
      let svgHtml = this.iconService.getIcon(this.name) as string;

      // Dynamically replace width, height, and color if provided
      if (this.width) svgHtml = svgHtml.replace(/w-\[.*?\]/, `w-[${this.width}]`);
      if (this.height) svgHtml = svgHtml.replace(/h-\d+/, `h-[${this.height}]`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (this.color) svgHtml = svgHtml.replace(/currentColor/g, this.color);

      this.svg = this.iconService.getIcon(this.name);
    }
  }
}
