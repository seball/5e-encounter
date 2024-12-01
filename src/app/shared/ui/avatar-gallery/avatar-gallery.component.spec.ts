import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarGalleryComponent } from './avatar-gallery.component';

describe('AvatarGalleryComponent', () => {
  let component: AvatarGalleryComponent;
  let fixture: ComponentFixture<AvatarGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarGalleryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
