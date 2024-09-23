import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaperedRuleComponent } from './tapered-rule.component';

describe('TaperedRuleComponent', () => {
  let component: TaperedRuleComponent;
  let fixture: ComponentFixture<TaperedRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaperedRuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaperedRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
