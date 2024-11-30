import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlefieldListComponent } from './battlefield-list.component';

describe('BattlefieldListComponent', () => {
  let component: BattlefieldListComponent;
  let fixture: ComponentFixture<BattlefieldListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattlefieldListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattlefieldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
