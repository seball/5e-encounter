import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 1;

  readonly activeToasts = this.toasts.asReadonly();

  showToast(message: string, type: ToastType = 'info'): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
    };

    this.toasts.update(current => [...current, toast]);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, 3000);
  }

  removeToast(id: number): void {
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }
}
