import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableNameDescriptionArrayComponent } from './editable-name-description-array.component';

describe('EditableNameDescriptionArrayComponent', () => {
  let component: EditableNameDescriptionArrayComponent;
  let fixture: ComponentFixture<EditableNameDescriptionArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableNameDescriptionArrayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableNameDescriptionArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
