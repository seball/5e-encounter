export interface Avatar {
  id: number;
  path: string;
  filename: string;
  selected: boolean;
  priority?: 'high' | 'low';
}

export type GalleryTab = 'avatars' | 'monsters';

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  DestroyRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../../../services/avatar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  avatars: Avatar[] = [];
  visibleAvatars: Avatar[] = [];
  loading = true;
  isLoadingMore = false;
  selectedAvatar: Avatar | null = null;
  activeTab: GalleryTab = 'avatars';
  skeletonArray = Array(16).fill(0);

  private pageSize = 20;
  private currentPage = 0;
  private intersectionObserver?: IntersectionObserver;
  private loadingTimeout?: number;

  constructor(
    private avatarService: AvatarService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadContent();
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
    if (this.loadingTimeout) {
      window.clearTimeout(this.loadingTimeout);
    }
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadNextPage();
          }
        });
      },
      { threshold: 0.5 }
    );
  }

  onScroll() {
    const element = this.scrollContainer.nativeElement;
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 200) {
      this.loadNextPage();
    }
  }

  private loadNextPage() {
    if (
      this.isLoadingMore ||
      this.currentPage * this.pageSize >= this.avatars.length
    ) {
      return;
    }

    this.isLoadingMore = true;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

    this.loadingTimeout = window.setTimeout(() => {
      const newItems = this.avatars.slice(start, end).map(avatar => ({
        ...avatar,
        priority: this.currentPage === 0 ? ('high' as const) : ('low' as const),
      }));

      this.visibleAvatars = [...this.visibleAvatars, ...newItems];
      this.currentPage++;
      this.isLoadingMore = false;
      this.cdr.detectChanges();
    }, 100);
  }

  loadContent() {
    this.loading = true;
    this.avatars = [];
    this.visibleAvatars = [];
    this.currentPage = 0;

    const service$ =
      this.activeTab === 'avatars'
        ? this.avatarService.getAvatarList()
        : this.avatarService.getMonsterList();

    service$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: filenames => {
        this.processInitialAvatars(filenames);
      },
      error: error => {
        console.error(`Error loading ${this.activeTab}:`, error);
        this.loading = false;
      },
    });
  }

  private processInitialAvatars(filenames: string[]) {
    const basePath = this.activeTab === 'avatars' ? 'portraits' : 'monsters';

    this.avatars = filenames.map((filename, index) => ({
      id: index + 1,
      path: `assets/${basePath}/${filename}`,
      filename,
      selected: false,
      priority: index < this.pageSize ? 'high' : ('low' as const),
    }));

    this.loading = false;
    this.loadNextPage();
  }

  selectAvatar(avatar: Avatar) {
    if (this.selectedAvatar?.id === avatar.id) return;

    this.avatars = this.avatars.map(a => ({
      ...a,
      selected: a.id === avatar.id,
    }));
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
    this.avatars = this.avatars.map(a => ({ ...a, selected: false }));
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('error');
    img.parentElement?.classList.add('error');
  }

  switchTab(tab: GalleryTab) {
    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.reset();
    this.loadContent();
  }

  trackById(_: number, item: Avatar): number {
    return item.id;
  }
}
