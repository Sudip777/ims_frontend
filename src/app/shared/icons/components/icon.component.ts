import { Component, Input, OnInit } from '@angular/core';
import { IconService } from '../services/icon.service';
import { SafeHtml } from '@angular/platform-browser';

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

  constructor(private iconService: IconService) {}

  ngOnInit() {
    if (this.name) {
      let svgHtml = this.iconService.getIcon(this.name) as string;

      // Dynamically replace width, height, and color if provided
      if (this.width) svgHtml = svgHtml.replace(/w-\[.*?\]/, `w-[${this.width}]`);
      if (this.height) svgHtml = svgHtml.replace(/h-\d+/, `h-[${this.height}]`);
      if (this.color) svgHtml = svgHtml.replace(/currentColor/g, this.color);

      this.svg = this.iconService.getIcon(this.name);
    }
  }
}
