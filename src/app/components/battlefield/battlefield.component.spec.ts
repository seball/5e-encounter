import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleFieldComponent } from './battlefield.component';

describe('BattlefieldComponent', () => {
  let component: BattleFieldComponent;
  let fixture: ComponentFixture<BattleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BattleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
