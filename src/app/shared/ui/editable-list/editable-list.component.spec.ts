import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListComponent } from './editable-list.component';

describe('EditableListComponent', () => {
  let component: EditableListComponent;
  let fixture: ComponentFixture<EditableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
