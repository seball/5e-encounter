import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../../../services/avatar.service';

interface Avatar {
  id: number;
  path: string;
  filename: string;
  selected: boolean;
}

@Component({
  selector: 'app-avatar-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-gallery.component.html',
  styleUrls: ['./avatar-gallery.component.scss'],
})
export class AvatarGalleryComponent implements OnInit {
  @Input() isOpen = false;
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  avatars: Avatar[] = [];
  loading = true;
  selectedAvatar: Avatar | null = null;

  constructor(private avatarService: AvatarService) {}

  ngOnInit() {
    this.loadAvatars();
  }

  loadAvatars() {
    this.loading = true;
    this.avatarService.getAvatarList().subscribe({
      next: filenames => {
        this.avatars = filenames.map((filename, index) => ({
          id: index + 1,
          path: `assets/portraits/${filename}`,
          filename: filename,
          selected: false,
        }));
        this.loading = false;
      },
      error: error => {
        console.error('Error loading avatars:', error);
        this.loading = false;
      },
    });
  }

  selectAvatar(avatar: Avatar) {
    this.avatars.forEach(a => (a.selected = false));
    avatar.selected = true;
    this.selectedAvatar = avatar;
  }

  onConfirm() {
    if (this.selectedAvatar) {
      this.confirm.emit(this.selectedAvatar.path);
    }
    this.reset();
  }

  onCancel() {
    this.cancel.emit();
    this.reset();
  }

  private reset() {
    this.selectedAvatar = null;
    this.avatars.forEach(a => (a.selected = false));
    this.isOpen = false;
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('error');
    img.parentElement?.classList.add('error');
  }
}
