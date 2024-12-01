import { computed, Injectable, signal } from '@angular/core';
import { Battlefield } from '../../interfaces/battlefield.interface';
import { BaseStorageService } from './base-storage.service';
import { Character } from '../../interfaces/character.interface';
import { v4 as uuid } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class BattlefieldStorageService extends BaseStorageService {
  private readonly BATTLEFIELD_KEY = 'battlefields';
  private readonly battlefieldsSignal = signal<Battlefield[]>([]);
  readonly battlefields = computed(() => this.battlefieldsSignal());

  constructor() {
    super();
    this.loadInitialBattlefields();
  }

  private loadInitialBattlefields(): void {
    const stored = this.get<Battlefield[]>(this.BATTLEFIELD_KEY);
    this.battlefieldsSignal.set(stored ?? []);
  }

  getAll(): Battlefield[] {
    return this.battlefieldsSignal();
  }

  getById(id: string): Battlefield | undefined {
    return this.getAll().find(battlefield => battlefield.id === id);
  }

  save(name: string, characters: Character[]): Battlefield {
    const battlefield = this.createBattlefield(name, characters);
    const updatedBattlefields = [...this.getAll(), battlefield];
    this.updateBattlefields(updatedBattlefields);
    return battlefield;
  }

  update(battlefield: Battlefield): void {
    const updatedBattlefields = this.getAll().map(bf =>
      bf.id === battlefield.id ? battlefield : bf
    );
    this.updateBattlefields(updatedBattlefields);
  }

  delete(id: string): void {
    const updatedBattlefields = this.getAll().filter(bf => bf.id !== id);
    this.updateBattlefields(updatedBattlefields);
  }

  private createBattlefield(
    name: string,
    characters: Character[]
  ): Battlefield {
    return {
      id: uuid(),
      name,
      timestamp: new Date().toISOString(),
      characters,
    };
  }

  private updateBattlefields(battlefields: Battlefield[]): void {
    this.set(this.BATTLEFIELD_KEY, battlefields);
    this.battlefieldsSignal.set(battlefields);
  }
}
