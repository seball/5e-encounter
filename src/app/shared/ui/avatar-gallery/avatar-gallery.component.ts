interface Avatar {
  id: number;
  path: string;
  filename: string;
  selected: boolean;
  priority?: 'high' | 'low';
}

type GalleryTab = 'avatars' | 'monsters';

const GALLERY_CONFIG = {
  PAGE_SIZE: 20,
  SCROLL_THRESHOLD: 200,
  LOADING_DELAY: 100,
  SKELETON_COUNT: 16,
  OBSERVER_THRESHOLD: 0.5,
  ASSET_PATHS: {
    avatars: 'portraits',
    monsters: 'monsters',
  },
} as const;

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
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
export class AvatarGalleryComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  avatars: Avatar[] = [];
  visibleAvatars: Avatar[] = [];
  loading = true;
  isLoadingMore = false;
  selectedAvatar: Avatar | null = null;
  activeTab: GalleryTab = 'avatars';
  skeletonArray = Array(GALLERY_CONFIG.SKELETON_COUNT).fill(0);

  private currentPage = 0;
  private intersectionObserver?: IntersectionObserver;
  private loadingTimeout?: number;

  constructor(
    private avatarService: AvatarService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeGallery();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Public Methods
  onScroll(): void {
    if (this.shouldLoadMoreContent()) {
      this.loadNextPage();
    }
  }

  selectAvatar(avatar: Avatar): void {
    if (this.selectedAvatar?.id === avatar.id) return;

    this.updateSelection(avatar);
    this.selectedAvatar = avatar;
    this.cdr.detectChanges();
  }

  onConfirm(): void {
    if (this.selectedAvatar) {
      this.confirm.emit(this.selectedAvatar.path);
    }
    this.reset();
  }

  onCancel(): void {
    this.cancel.emit();
    this.reset();
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement;

    if (img) img.classList.add('error');
    if (parent) parent.classList.add('error');
  }

  switchTab(tab: GalleryTab): void {
    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.reset();
    this.loadContent();
  }

  trackById(_: number, item: Avatar): number {
    return item.id;
  }

  // Private Methods
  private initializeGallery(): void {
    this.loadContent();
    this.setupIntersectionObserver();
  }

  private cleanup(): void {
    this.intersectionObserver?.disconnect();
    if (this.loadingTimeout) {
      window.clearTimeout(this.loadingTimeout);
    }
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: GALLERY_CONFIG.OBSERVER_THRESHOLD }
    );
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadNextPage();
      }
    });
  }

  private shouldLoadMoreContent(): boolean {
    const element = this.scrollContainer.nativeElement;
    return (
      element.scrollHeight - element.scrollTop - element.clientHeight <
      GALLERY_CONFIG.SCROLL_THRESHOLD
    );
  }

  private loadContent(): void {
    this.resetLoadingState();

    const service$ = this.getServiceForActiveTab();

    service$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: this.handleContentLoaded.bind(this),
      error: this.handleError.bind(this),
    });
  }

  private getServiceForActiveTab() {
    return this.activeTab === 'avatars'
      ? this.avatarService.getAvatarList()
      : this.avatarService.getMonsterList();
  }

  private handleContentLoaded(filenames: string[]): void {
    this.processInitialAvatars(filenames);
    this.loading = false;
    this.loadNextPage();
  }

  private handleError(error: unknown): void {
    console.error(`Error loading ${this.activeTab}:`, error);
    this.loading = false;
  }

  private processInitialAvatars(filenames: string[]): void {
    const basePath = GALLERY_CONFIG.ASSET_PATHS[this.activeTab];

    this.avatars = filenames.map((filename, index) => ({
      id: index + 1,
      path: `assets/${basePath}/${filename}`,
      filename,
      selected: false,
      priority: this.getPriorityForIndex(index),
    }));
  }

  private getPriorityForIndex(index: number): 'high' | 'low' {
    return index < GALLERY_CONFIG.PAGE_SIZE ? 'high' : 'low';
  }

  private loadNextPage(): void {
    if (this.isLoadingBlocked()) return;

    this.isLoadingMore = true;
    this.scheduleNextPageLoad();
  }

  private isLoadingBlocked(): boolean {
    return (
      this.isLoadingMore ||
      this.currentPage * GALLERY_CONFIG.PAGE_SIZE >= this.avatars.length
    );
  }

  private scheduleNextPageLoad(): void {
    this.loadingTimeout = window.setTimeout(() => {
      this.loadPageContent();
    }, GALLERY_CONFIG.LOADING_DELAY);
  }

  private loadPageContent(): void {
    const { start, end } = this.getPageRange();
    const newItems = this.prepareNewItems(start, end);

    this.visibleAvatars = [...this.visibleAvatars, ...newItems];
    this.currentPage++;
    this.isLoadingMore = false;
    this.cdr.detectChanges();
  }

  private getPageRange() {
    const start = this.currentPage * GALLERY_CONFIG.PAGE_SIZE;
    const end = start + GALLERY_CONFIG.PAGE_SIZE;
    return { start, end };
  }

  private prepareNewItems(start: number, end: number): Avatar[] {
    return this.avatars.slice(start, end).map(avatar => ({
      ...avatar,
      priority: this.currentPage === 0 ? 'high' : 'low',
    }));
  }

  private updateSelection(selectedAvatar: Avatar): void {
    const updateSelected = (avatar: Avatar) => ({
      ...avatar,
      selected: avatar.id === selectedAvatar.id,
    });

    this.avatars = this.avatars.map(updateSelected);
    this.visibleAvatars = this.visibleAvatars.map(updateSelected);
  }

  private reset(): void {
    this.selectedAvatar = null;
    this.resetAvatarSelection();
  }

  private resetLoadingState(): void {
    this.loading = true;
    this.avatars = [];
    this.visibleAvatars = [];
    this.currentPage = 0;
  }

  private resetAvatarSelection(): void {
    this.avatars = this.avatars.map(a => ({ ...a, selected: false }));
  }
}
