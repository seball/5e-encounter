import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableTextboxComponent } from './expandable-textbox.component';

describe('ExpandableTextboxComponent', () => {
  let component: ExpandableTextboxComponent;
  let fixture: ComponentFixture<ExpandableTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableTextboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandableTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
