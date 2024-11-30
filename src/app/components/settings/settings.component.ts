import { Component, computed, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { SettingsFacade } from '../../facades/settings.facade';
import { ConfirmActionComponent } from '../../shared/ui/confirm-action/confirm-action.component';
import { Statblock } from '../../interfaces/statblock.interface';
import { LucideAngularModule } from 'lucide-angular/src/icons';
import { ImportEncounterComponent } from './import-encounter/import-encounter.component';
import { ExportEncounterComponent } from './export-encounter/export-encounter.component';
import { CustomStatblocksComponent } from './custom-statblocks/custom-statblocks.component';
import { SaveBattlefieldComponent } from './save-battlefield/save-battlefield.component';
import { BattlefieldListComponent } from './battlefield-list/battlefield-list.component';
import { Battlefield } from '../../interfaces/battlefield.interface';
import { ApiKeyComponent } from './api-key/api-key.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    NgxFileDropModule,
    ConfirmActionComponent,
    LucideAngularModule,
    ImportEncounterComponent,
    ExportEncounterComponent,
    CustomStatblocksComponent,
    SaveBattlefieldComponent,
    BattlefieldListComponent,
    ApiKeyComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent {
  // Signals for various UI states
  private importConfirmSignal = signal(false);
  private deleteConfirmSignal = signal(false);
  private pendingFilesSignal = signal<NgxFileDropEntry[] | null>(null);
  private pendingDeleteStatblockSignal = signal<Statblock | null>(null);
  private deleteConfirmMessageSignal = signal<string>('');
  private battlefieldToDeleteSignal = signal<Battlefield | null>(null);
  private battlefieldToLoadSignal = signal<Battlefield | null>(null);

  readonly statblocks = computed(() => this.settingsFacade.statblocks());
  readonly battlefields = computed(() => this.settingsFacade.battlefields());
  readonly showBattlefieldDeleteConfirm = computed(
    () => this.battlefieldToDeleteSignal() !== null
  );
  readonly showBattlefieldLoadConfirm = computed(
    () => this.battlefieldToLoadSignal() !== null
  );
  readonly showImportConfirm = computed(() => this.importConfirmSignal());
  readonly showDeleteConfirm = computed(() => this.deleteConfirmSignal());

  readonly battlefieldDeleteConfirmMessage = computed(() =>
    this.battlefieldToDeleteSignal()?.name
      ? `Are you sure you want to delete the battlefield "${this.battlefieldToDeleteSignal()!.name}"?`
      : ''
  );
  readonly battlefieldLoadConfirmMessage = computed(() =>
    this.battlefieldToLoadSignal()?.name
      ? `Loading "${this.battlefieldToLoadSignal()!.name}" will replace your current characters. Are you sure?`
      : ''
  );

  readonly deleteConfirmMessage = computed(() =>
    this.pendingDeleteStatblockSignal()?.name
      ? `Are you sure you want to delete "${this.pendingDeleteStatblockSignal()!.name}" statblock? This action cannot be undone.`
      : ''
  );

  constructor(private readonly settingsFacade: SettingsFacade) {}

  dropped(files: NgxFileDropEntry[]): void {
    this.pendingFilesSignal.set(files);
    this.importConfirmSignal.set(true);
  }

  async handleImportConfirm(): Promise<void> {
    const files = this.pendingFilesSignal();
    if (files) {
      await this.settingsFacade.handleFileUpload(files);
      this.clearImportState();
    }
  }

  handleImportCancel(): void {
    this.clearImportState();
  }

  private clearImportState(): void {
    this.pendingFilesSignal.set(null);
    this.importConfirmSignal.set(false);
  }

  deleteStatblock(statblock: Statblock): void {
    this.pendingDeleteStatblockSignal.set(statblock);
    this.deleteConfirmSignal.set(true);
  }

  handleDeleteConfirm(): void {
    const statblock = this.pendingDeleteStatblockSignal();
    if (statblock) {
      this.settingsFacade.deleteStatblock(statblock.id, statblock.name);
      this.clearDeleteState();
    }
  }

  handleDeleteCancel(): void {
    this.clearDeleteState();
  }

  private clearDeleteState(): void {
    this.pendingDeleteStatblockSignal.set(null);
    this.deleteConfirmSignal.set(false);
    this.deleteConfirmMessageSignal.set('');
  }

  saveBattlefield(name: string): void {
    this.settingsFacade.saveBattlefield(name.trim());
  }

  loadBattlefield(battlefield: Battlefield): void {
    this.battlefieldToLoadSignal.set(battlefield);
  }

  deleteBattlefield(battlefield: Battlefield): void {
    this.battlefieldToDeleteSignal.set(battlefield);
  }

  handleBattlefieldDeleteConfirm(): void {
    const battlefield = this.battlefieldToDeleteSignal();
    if (battlefield) {
      this.settingsFacade.deleteBattlefield(battlefield.id);
    }
    this.battlefieldToDeleteSignal.set(null);
  }

  handleBattlefieldDeleteCancel(): void {
    this.battlefieldToDeleteSignal.set(null);
  }

  handleBattlefieldLoadConfirm(): void {
    const battlefield = this.battlefieldToLoadSignal();
    if (battlefield) {
      this.settingsFacade.loadBattlefield(battlefield.id);
    }
    this.battlefieldToLoadSignal.set(null);
  }

  handleBattlefieldLoadCancel(): void {
    this.battlefieldToLoadSignal.set(null);
  }

  exportData(filename: string): void {
    this.settingsFacade.exportCharacters(filename);
  }

  saveApiKey(apiKey: string): void {
    this.settingsFacade.saveApiKey(apiKey);
  }
}
