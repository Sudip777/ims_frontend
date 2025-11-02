import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS_MAP } from '../svg';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private sanitizer = inject(DomSanitizer);

  getIcon(name: string): SafeHtml {
    const svg = ICONS_MAP[name];
    if (!svg) {
      console.warn(`Icon "${name}" not found`);
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
