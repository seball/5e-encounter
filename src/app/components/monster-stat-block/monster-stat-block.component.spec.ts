import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterStatBlockComponent } from './monster-stat-block.component';
import { CommonModule } from '@angular/common';

describe('MonsterStatBlockComponent', () => {
  let component: MonsterStatBlockComponent;
  let fixture: ComponentFixture<MonsterStatBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonsterStatBlockComponent, CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterStatBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
