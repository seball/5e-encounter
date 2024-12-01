import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionsComponent } from './reactions.component';

describe('ActionsComponent', () => {
  let component: ReactionsComponent;
  let fixture: ComponentFixture<ReactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
