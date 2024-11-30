import { computed, Injectable, signal } from '@angular/core';
import { Statblock } from '../../interfaces/statblock.interface';
import { BaseStorageService } from './base-storage.service';
import { v4 as uuid } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class StatblockStorageService extends BaseStorageService {
  private readonly STATBLOCK_KEY = 'statblocks';
  private readonly statblocksSignal = signal<Statblock[]>([]);
  readonly statblocks = computed(() => this.statblocksSignal());

  constructor() {
    super();
    this.loadInitialStatblocks();
  }

  private loadInitialStatblocks(): void {
    const stored = this.get<Statblock[]>(this.STATBLOCK_KEY);
    this.statblocksSignal.set(stored ?? []);
  }

  getAll(): Statblock[] {
    return this.statblocksSignal();
  }

  save(statblock: Statblock): void {
    const statblockWithId: Statblock = { ...statblock, id: uuid() };
    const updatedStatblocks = [...this.getAll(), statblockWithId];
    this.updateStatblocks(updatedStatblocks);
  }

  delete(id: string): void {
    const updatedStatblocks = this.getAll().filter(s => s.id !== id);
    this.updateStatblocks(updatedStatblocks);
  }

  private updateStatblocks(statblocks: Statblock[]): void {
    this.set(this.STATBLOCK_KEY, statblocks);
    this.statblocksSignal.set(statblocks);
  }
}
