import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialAbilitiesComponent } from './special-abilities.component';

describe('SpecialAbilitiesComponent', () => {
  let component: SpecialAbilitiesComponent;
  let fixture: ComponentFixture<SpecialAbilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialAbilitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
