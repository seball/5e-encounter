import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LairActionsComponent } from './lair-actions.component';

describe('LairActionsComponent', () => {
  let component: LairActionsComponent;
  let fixture: ComponentFixture<LairActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LairActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LairActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
