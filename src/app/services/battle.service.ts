import { Injectable, signal, computed, type Signal } from '@angular/core';
import { CharacterService } from './character.service';
import { ViewManagerService } from './viewManager.service';

interface CharacterOrder {
  id: string;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  private readonly characterIds = signal<string[]>([]);
  private readonly currentIndex = signal<number>(0);
  private readonly exhaustedIds = signal<Set<string>>(new Set());
  private readonly roundCounter = signal<number>(1);
  readonly isFirstTurn = signal<boolean>(true);

  readonly activeCharacter: Signal<string | null> = computed(() => {
    const ids = this.characterIds();
    const index = this.currentIndex();
    return ids.length > 0 ? ids[index] : null;
  });

  readonly previousCharacter: Signal<string | null> = computed(() => {
    const ids = this.characterIds();
    const index = this.currentIndex();
    if (ids.length === 0 || this.isFirstTurn()) return null;

    const previousIndex = this.calculatePreviousIndex(index, ids.length);
    return ids[previousIndex];
  });

  readonly nextCharacter: Signal<string | null> = computed(() => {
    const ids = this.characterIds();
    const index = this.currentIndex();
    if (ids.length === 0) return null;

    const nextIndex = this.calculateNextIndex(index, ids.length);
    return ids[nextIndex];
  });

  readonly currentRound: Signal<number> = computed(() => this.roundCounter());

  readonly characterOrderList: Signal<CharacterOrder[]> = computed(() => {
    const ids = this.characterIds();
    const currentIndex = this.currentIndex();
    const exhausted = this.exhaustedIds();
    const totalCharacters = ids.length;

    return ids.map((id, index) => ({
      id,
      order: this.calculateCharacterOrder(
        id,
        index,
        currentIndex,
        totalCharacters,
        exhausted
      ),
    }));
  });

  constructor(
    private readonly characterService: CharacterService,
    private readonly viewManagerService: ViewManagerService
  ) {}

  initializeCharacters(ids: string[]): void {
    if (!ids.length) {
      throw new Error('Cannot initialize battle with empty character list');
    }
    this.viewManagerService.enterBattleMode();
    this.resetState(ids);
    this.activateInitialCharacter(ids[0]);
  }

  activateNext(): void {
    const ids = this.characterIds();
    if (!ids.length) return;

    const currentId = ids[this.currentIndex()];
    this.exhaustCurrentCharacter(currentId);

    const newIndex = this.calculateNextIndex(this.currentIndex(), ids.length);
    this.handleRoundTransition(newIndex);

    this.updateBattleState(newIndex, ids[newIndex]);
  }

  activatePrevious(): void {
    const ids = this.characterIds();
    if (!ids.length || this.isFirstTurn()) return;

    const newIndex = this.calculatePreviousIndex(
      this.currentIndex(),
      ids.length
    );
    const previousCharacterId = ids[newIndex];
    if (newIndex === ids.length - 1) {
      this.handleRoundTransitionReverse(ids);
    }
    this.unexhaustCharacter(previousCharacterId);
    this.updateBattleState(newIndex, previousCharacterId);
  }

  exitBattle(): void {
    this.viewManagerService.exitBattleMode();
    this.resetState([]);
  }

  isCharacterActive(id: string): boolean {
    return this.activeCharacter() === id;
  }

  isCharacterPrevious(id: string): boolean {
    return this.previousCharacter() === id;
  }

  isCharacterNext(id: string): boolean {
    return this.nextCharacter() === id;
  }

  isCharacterExhausted(id: string): boolean {
    return this.exhaustedIds().has(id);
  }

  private calculatePreviousIndex(currentIndex: number, length: number): number {
    return (currentIndex - 1 + length) % length;
  }

  private calculateNextIndex(currentIndex: number, length: number): number {
    return (currentIndex + 1) % length;
  }

  private calculateCharacterOrder(
    id: string,
    index: number,
    currentIndex: number,
    totalCharacters: number,
    exhausted: Set<string>
  ): number {
    if (exhausted.has(id)) {
      return totalCharacters + index;
    }
    const relativeOrder =
      (index - currentIndex + totalCharacters) % totalCharacters;
    return relativeOrder + 1;
  }

  private resetState(ids: string[]): void {
    this.characterIds.set([...ids]);
    this.currentIndex.set(0);
    this.exhaustedIds.set(new Set());
    this.roundCounter.set(1);
    this.isFirstTurn.set(true);
  }

  private activateInitialCharacter(id: string): void {
    this.characterService.activateCharacter(id);
  }

  private exhaustCurrentCharacter(id: string): void {
    this.exhaustedIds.update(set => {
      const newSet = new Set(set);
      newSet.add(id);
      return newSet;
    });
  }

  private unexhaustCharacter(id: string): void {
    this.exhaustedIds.update(set => {
      const newSet = new Set(set);
      newSet.delete(id);
      return newSet;
    });
  }

  private handleRoundTransition(newIndex: number): void {
    if (newIndex === 0) {
      this.exhaustedIds.set(new Set());
      this.roundCounter.update(round => round + 1);
    }
  }

  private handleRoundTransitionReverse(ids: string[]): void {
    this.exhaustedIds.update(() => {
      const newSet = new Set<string>();
      ids.slice(0, -1).forEach(id => newSet.add(id));
      return newSet;
    });
    this.roundCounter.update(round => Math.max(1, round - 1));
  }

  private updateBattleState(newIndex: number, nextCharacterId: string): void {
    this.currentIndex.set(newIndex);
    this.characterService.activateCharacter(nextCharacterId);
    this.isFirstTurn.set(false);
  }
}
