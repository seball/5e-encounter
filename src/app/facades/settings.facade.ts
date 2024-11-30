import { computed, Injectable } from '@angular/core';
import { CharacterService } from '../services/character.service';

import { FileHandlerService } from '../services/file-handler.service';
import { ToastService } from '../services/toast.service';

import { NgxFileDropEntry } from 'ngx-file-drop';
import { Battlefield } from '../interfaces/battlefield.interface';
import { StorageFacade } from './storage.facade';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  constructor(
    private characterService: CharacterService,
    private fileHandler: FileHandlerService,
    private toastService: ToastService,
    private storageFacade: StorageFacade
  ) {}

  readonly statblocks = computed(() => this.storageFacade.statblocks());
  readonly battlefields = computed(() => this.storageFacade.battlefields());

  async handleFileUpload(files: NgxFileDropEntry[]): Promise<string | null> {
    try {
      const file = await this.fileHandler.getFileFromDrop(files);
      if (!file) return null;

      await this.characterService.importCharacters(file);
      this.showSuccessToast('Characters imported successfully');
      return file.name;
    } catch (error) {
      this.handleError(error, 'Failed to import characters');
      return null;
    }
  }

  deleteStatblock(id: string, name: string): void {
    try {
      this.storageFacade.deleteStatblock(id);
      this.showSuccessToast(`Statblock "${name}" deleted successfully`);
    } catch (error) {
      this.handleError(error, 'Failed to delete statblock');
    }
  }

  exportCharacters(filename: string): void {
    try {
      const processedFilename = this.fileHandler.processFilename(filename);
      this.characterService.exportCharacters(processedFilename);
      this.showSuccessToast('Characters exported successfully');
    } catch (error) {
      this.handleError(error, 'Failed to export characters');
    }
  }

  getImportFileAccept(): string {
    return this.fileHandler.getAcceptedFileTypes();
  }

  saveBattlefield(name: string): Battlefield {
    try {
      const characters = this.characterService.characters();
      const battlefield = this.storageFacade.saveBattlefield(name, characters);
      this.showSuccessToast(`Battlefield "${name}" saved successfully`);
      return battlefield;
    } catch (error) {
      this.handleError(error, 'Failed to save battlefield');
      throw error;
    }
  }

  loadBattlefield(id: string): void {
    try {
      const battlefield = this.storageFacade.getBattlefieldById(id);
      if (!battlefield) throw new Error('Battlefield not found');
      this.characterService.setCharactersFromBattlefield(
        battlefield.characters
      );
      this.showSuccessToast(
        `Battlefield "${battlefield.name}" loaded successfully`
      );
    } catch (error) {
      this.handleError(error, 'Failed to load battlefield');
    }
  }

  deleteBattlefield(id: string): void {
    try {
      const battlefield = this.storageFacade.getBattlefieldById(id);
      if (!battlefield) throw new Error('Battlefield not found');

      this.storageFacade.deleteBattlefield(id);
      this.showSuccessToast(
        `Battlefield "${battlefield.name}" deleted successfully`
      );
    } catch (error) {
      this.handleError(error, 'Failed to delete battlefield');
    }
  }

  getApiKey(): string | null {
    return this.storageFacade.getApiKey();
  }

  saveApiKey(apiKey: string): void {
    try {
      this.storageFacade.saveApiKey(apiKey);
      this.toastService.showToast('API key saved successfully', 'success');
    } catch (error) {
      this.handleError(error, 'Failed to save API key');
    }
  }

  private showSuccessToast(message: string): void {
    this.toastService.showToast(message, 'success');
  }

  private handleError(error: unknown, defaultMessage: string): void {
    const errorMessage =
      error instanceof Error ? error.message : defaultMessage;
    this.toastService.showToast(errorMessage, 'error');
    throw error;
  }
}
