import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEncounterComponent } from './import-encounter.component';

describe('ImportEncounterComponent', () => {
  let component: ImportEncounterComponent;
  let fixture: ComponentFixture<ImportEncounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportEncounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
