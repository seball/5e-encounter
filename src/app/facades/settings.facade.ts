import { computed, Injectable } from '@angular/core';
import { CharacterService } from '../services/character.service';

import { FileHandlerService } from '../services/file-handler.service';
import { ToastService } from '../services/toast.service';
import { StorageService } from '../services/storage.service';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  constructor(
    private characterService: CharacterService,
    private fileHandler: FileHandlerService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  readonly statblocks = computed(() => this.storageService.statblocks());

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
      const currentStatblocks = this.statblocks();
      const updatedStatblocks = currentStatblocks.filter(
        statblock => statblock.id !== id
      );

      this.storageService.setStatblocks(updatedStatblocks);
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
