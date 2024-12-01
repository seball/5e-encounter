import { Injectable } from '@angular/core';
import { BaseStorageService } from './base-storage.service';
import { ViewType } from '../viewManager.service';

@Injectable({
  providedIn: 'root',
})
export class ViewStorageService extends BaseStorageService {
  private readonly VIEW_KEY = 'view';

  getView(): ViewType {
    return this.get<ViewType>(this.VIEW_KEY) ?? ViewType.Manual;
  }

  setView(view: ViewType): void {
    this.set(this.VIEW_KEY, view);
  }
}
