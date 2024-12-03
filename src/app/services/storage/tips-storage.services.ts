import { Injectable } from '@angular/core';
import { BaseStorageService } from './base-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TipsStorageService extends BaseStorageService {
  private readonly TIPS_KEY = 'tips';

  isDismissed(tipId: string): boolean {
    return this.get<boolean>(`${this.TIPS_KEY}_${tipId}`) ?? false;
  }

  setDismissed(tipId: string, dismissed: boolean): void {
    this.set(`${this.TIPS_KEY}_${tipId}`, dismissed);
  }
}
