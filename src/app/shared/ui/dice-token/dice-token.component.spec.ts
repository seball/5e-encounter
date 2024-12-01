import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceTokenComponent } from './dice-token.component';

describe('DiceTokenComponent', () => {
  let component: DiceTokenComponent;
  let fixture: ComponentFixture<DiceTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiceTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiceTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
