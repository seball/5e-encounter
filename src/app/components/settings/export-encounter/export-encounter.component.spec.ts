import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEncounterComponent } from './export-encounter.component';

describe('ExportEncounterComponent', () => {
  let component: ExportEncounterComponent;
  let fixture: ComponentFixture<ExportEncounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportEncounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
