import { Component } from '@angular/core';
import { Toast, ToastService } from '../../../services/toast.service';
import { LucideAngularModule, XIcon } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  constructor(private readonly toastService: ToastService) {}
  public xIcon = XIcon;
  activeToasts(): Toast[] {
    return this.toastService.activeToasts();
  }
  removeToast(id: number) {
    return this.toastService.removeToast(id);
  }
}
