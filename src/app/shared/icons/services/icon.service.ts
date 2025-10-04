import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS_MAP } from '../svg';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private sanitizer: DomSanitizer) {}

  getIcon(name: string): SafeHtml {
    const svg = ICONS_MAP[name];
    if (!svg) {
      console.warn(`Icon "${name}" not found`);
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
