import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendaryActionsComponent } from './legendary-actions.component';

describe('LegendaryActionsComponent', () => {
  let component: LegendaryActionsComponent;
  let fixture: ComponentFixture<LegendaryActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendaryActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegendaryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
