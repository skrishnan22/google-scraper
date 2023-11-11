import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  showSuccess(body: string, delay: number = 2000, header?: string) {
    this.toasts.push({ header, body, delay, className: 'bg-success text-light' });
  }

  showError(body: string, delay: number = 2000, header?: string) {
    this.toasts.push({ header, body, delay, className: 'bg-danger text-light' });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
