import { Component } from '@angular/core';
import { AvatarGalleryComponent } from '../../shared/ui/avatar-gallery/avatar-gallery.component';

@Component({
  selector: 'app-manual',
  standalone: true,
  imports: [AvatarGalleryComponent],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.css',
})
export class ManualComponent {}
