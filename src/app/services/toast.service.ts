import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastId = 0;
  toasts = signal<Toast[]>([]);

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 5000
  ): void {
    const id = ++this.toastId;
    const toast: Toast = { id, message, type, duration };

    this.toasts.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  remove(id: number): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
