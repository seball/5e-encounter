import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureHeadingComponent } from './creature-heading.component';

describe('CreatureHeadingComponent', () => {
  let component: CreatureHeadingComponent;
  let fixture: ComponentFixture<CreatureHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatureHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatureHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
