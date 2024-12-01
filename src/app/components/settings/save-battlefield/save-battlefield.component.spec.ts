import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBattlefieldComponent } from './save-battlefield.component';

describe('SaveBattlefieldComponent', () => {
  let component: SaveBattlefieldComponent;
  let fixture: ComponentFixture<SaveBattlefieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveBattlefieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveBattlefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
