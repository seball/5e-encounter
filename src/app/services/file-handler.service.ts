import { Injectable } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Injectable({
  providedIn: 'root',
})
export class FileHandlerService {
  async getFileFromDrop(files: NgxFileDropEntry[]): Promise<File | null> {
    const droppedFile = files[0];
    if (!droppedFile?.fileEntry.isFile) return null;

    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    if (!droppedFile.relativePath.endsWith('.json')) {
      throw new Error('Please upload a JSON file');
    }

    return this.getFileFromEntry(fileEntry);
  }

  processFilename(filename: string): string {
    return filename.replace(/\.json$/, '') + '.json';
  }

  confirmDeletion(name: string): boolean {
    return confirm(
      `Are you sure you want to delete "${name}" statblock? This action cannot be undone.`
    );
  }

  getAcceptedFileTypes(): string {
    return '.json,application/json';
  }

  private getFileFromEntry(fileEntry: FileSystemFileEntry): Promise<File> {
    return new Promise(resolve => {
      fileEntry.file(resolve);
    });
  }
}
