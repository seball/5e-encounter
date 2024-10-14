import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollOrderComponent } from './roll-order.component';

describe('RollOrderComponent', () => {
  let component: RollOrderComponent;
  let fixture: ComponentFixture<RollOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
