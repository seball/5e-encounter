import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';

@Component({
  selector: 'app-import-encounter',
  standalone: true,
  imports: [CommonModule, NgxFileDropModule],
  templateUrl: './import-encounter.component.html',
  styleUrl: './import-encounter.component.scss',
})
export class ImportEncounterComponent {
  @Output() fileDropped = new EventEmitter<NgxFileDropEntry[]>();

  dropped(files: NgxFileDropEntry[]): void {
    this.fileDropped.emit(files);
  }
}
