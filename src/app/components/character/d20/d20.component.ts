import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberToStringPipe } from '../../../shared/pipes/number-to-string.pipe';
import { DAMAGE_SOURCES_TAGS } from '../../../config/option-configs';
import { CharacterFacade } from '../../../facades/character.facade';

@Component({
  selector: 'app-d20',
  standalone: true,
  imports: [FormsModule, CommonModule, NumberToStringPipe],
  templateUrl: './d20.component.html',
  styleUrls: ['./d20.component.scss'],
})
export class D20Component implements OnInit {
  @Input() hasRolledInitiative: boolean = false;
  @Input() offsetY: number = 0;
  @Input() characterType: 'ally' | 'enemy' = 'ally';
  @Input() initiativeRoll: number | null = null;
  @Input() initiativeMod: number = 0;
  @Input() initiativeScore: number | null = null;

  @Output() hasRolledInitiativeChange = new EventEmitter<boolean>();
  @Output() initiativeRollChange = new EventEmitter<number>();
  @Output() initiativeModChange = new EventEmitter<number>();
  @Output() initiativeScoreChange = new EventEmitter<number>();
  @ViewChild('diceSvg', { static: true }) diceSvg!: ElementRef;
  @ViewChild('diceButton', { static: true }) diceButton!: ElementRef;

  isSpinning = false;
  private readonly spinDuration = 3;
  private hasUserInteracted: boolean = false;
  constructor(private readonly characterFacade: CharacterFacade) {}
  private colorTags = DAMAGE_SOURCES_TAGS;

  ngOnInit() {
    this.updateSvgColor();
    this.updateInitiativeScore();
  }

  private getRandomColorName(): string {
    const tagName =
      this.colorTags[Math.floor(Math.random() * this.colorTags.length)];
    return `--color-${tagName}`;
  }

  updateSvgColor() {
    const root = document.documentElement;
    const colorStroke = getComputedStyle(root)
      .getPropertyValue(this.getRandomColorName())
      .trim();
    if (this.diceSvg && this.diceSvg.nativeElement) {
      const svgElements =
        this.diceSvg.nativeElement.querySelectorAll('path, polygon');
      svgElements.forEach((element: SVGElement) => {
        element.style.stroke = colorStroke;
      });
    }
  }

  onClick() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.diceButton.nativeElement.disabled = true;

    const spinningElement = this.diceSvg.nativeElement;
    spinningElement.style.animationDuration = `${this.spinDuration}s`;
    spinningElement.classList.add('spinning');

    spinningElement.addEventListener(
      'animationend',
      () => this.stopSpinning(),
      { once: true }
    );

    this.hasUserInteracted = true;
  }

  private stopSpinning() {
    this.isSpinning = false;
    this.diceSvg.nativeElement.classList.remove('spinning');
    this.diceButton.nativeElement.disabled = false;
    this.generateRandomValue();
    this.initiativeRollChange.emit(this.initiativeRoll!);
    this.updateInitiativeScore();
    this.emitRolledInitiative();
  }

  private generateRandomValue() {
    this.initiativeRoll = Math.floor(Math.random() * 20) + 1;
  }

  updateInitiativeScore() {
    if (this.initiativeRoll !== null) {
      this.initiativeScore = this.initiativeRoll + this.initiativeMod;
      this.initiativeScoreChange.emit(this.initiativeScore);
      this.characterFacade.notifyInitiativeChanged();
    }
  }

  onModChange(value: number) {
    this.initiativeMod = value;
    this.initiativeModChange.emit(this.initiativeMod);
    this.updateInitiativeScore();
    this.hasUserInteracted = true;
    this.emitRolledInitiative();
  }

  onRollChange(value: number | null) {
    this.initiativeRoll = value;
    if (value !== null) {
      this.initiativeRollChange.emit(value);
      this.updateInitiativeScore();
    }
    this.hasUserInteracted = true;
    this.emitRolledInitiative();
  }

  onScoreChange(value: number | null) {
    this.initiativeScore = value;
    if (value !== null) {
      this.initiativeScoreChange.emit(value);
      this.characterFacade.notifyInitiativeChanged();
    }
    this.hasUserInteracted = true;
    this.emitRolledInitiative();
  }

  getDisplayValue(value: number | null): string {
    return value === null ? '--' : value.toString();
  }

  private emitRolledInitiative() {
    if (this.hasUserInteracted) {
      this.hasRolledInitiative = true;
      this.hasRolledInitiativeChange.emit(this.hasRolledInitiative);
    }
  }
}
