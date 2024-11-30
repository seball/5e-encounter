import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStatblocksComponent } from './custom-statblocks.component';

describe('CustomStatblocksComponent', () => {
  let component: CustomStatblocksComponent;
  let fixture: ComponentFixture<CustomStatblocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomStatblocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomStatblocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
