import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { SettingsFacade } from '../../facades/settings.facade';
import { signal } from '@angular/core';
import { ConfirmActionComponent } from '../../shared/ui/confirm-action/confirm-action.component';
import { Statblock } from '../../interfaces/statblock.interface';
import { LucideAngularModule, XIcon } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    NgxFileDropModule,
    ConfirmActionComponent,
    LucideAngularModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent {
  exportFilename = signal<string>('');
  showImportConfirm = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  pendingFiles = signal<NgxFileDropEntry[] | null>(null);
  pendingDeleteStatblock = signal<Statblock | null>(null);
  deleteConfirmMessage = signal<string>('');
  xIcon = XIcon;

  constructor(public settingsFacade: SettingsFacade) {}

  async dropped(files: NgxFileDropEntry[]): Promise<void> {
    this.pendingFiles.set(files);
    this.showImportConfirm.set(true);
  }

  async handleImportConfirm(): Promise<void> {
    const files = this.pendingFiles();
    if (files) {
      await this.settingsFacade.handleFileUpload(files);
      this.pendingFiles.set(null);
    }
    this.showImportConfirm.set(false);
  }

  handleImportCancel(): void {
    this.pendingFiles.set(null);
    this.showImportConfirm.set(false);
  }

  exportData(): void {
    if (this.exportFilename()) {
      this.settingsFacade.exportCharacters(this.exportFilename());
    }
  }

  updateExportFilename(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.exportFilename.set(input.value);
  }

  deleteStatblock(statblock: Statblock): void {
    this.pendingDeleteStatblock.set(statblock);
    this.deleteConfirmMessage.set(
      `Are you sure you want to delete "${statblock.name}" statblock? This action cannot be undone.`
    );
    this.showDeleteConfirm.set(true);
  }

  handleDeleteConfirm(): void {
    const statblock = this.pendingDeleteStatblock();
    if (statblock) {
      this.settingsFacade.deleteStatblock(statblock.id, statblock.name);
    }
    this.handleDeleteCancel();
  }

  handleDeleteCancel(): void {
    this.pendingDeleteStatblock.set(null);
    this.showDeleteConfirm.set(false);
    this.deleteConfirmMessage.set('');
  }
}
