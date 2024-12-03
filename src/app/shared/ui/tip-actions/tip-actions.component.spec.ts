import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipActionsComponent } from './tip-actions.component';

describe('TipActionsComponent', () => {
  let component: TipActionsComponent;
  let fixture: ComponentFixture<TipActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
