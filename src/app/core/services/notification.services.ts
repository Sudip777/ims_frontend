import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService);

  //toasts
  success(summary: string, detail = '', life?: number): void {
    this.messageService.add({ severity: 'success', summary, detail, life });
  }

  error(summary: string, detail = '', life?: number): void {
    this.messageService.add({ severity: 'error', summary, detail, life });
  }

  warn(summary: string, detail = '', life?: number): void {
    this.messageService.add({ severity: 'warn', summary, detail, life });
  }

  info(summary: string, detail = '', life?: number): void {
    this.messageService.add({ severity: 'info', summary, detail, life });
  }

  clear(): void {
    this.messageService.clear();
  }
}
