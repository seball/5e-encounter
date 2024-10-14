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

@Component({
  selector: 'app-d20',
  standalone: true,
  imports: [FormsModule, CommonModule, NumberToStringPipe],
  templateUrl: './d20.component.html',
  styleUrls: ['./d20.component.scss'],
})
export class D20Component implements OnInit {
  @Input() offsetY: number = 0;
  @Input() characterType: 'ally' | 'enemy' = 'ally';
  @Input() initiativeRoll: number = 1;
  @Input() initiativeMod: number = 0;
  @Output() initiativeRollChange = new EventEmitter<number>();
  @ViewChild('diceSvg', { static: true }) diceSvg!: ElementRef;
  @ViewChild('diceButton', { static: true }) diceButton!: ElementRef;

  isSpinning = false;
  private readonly spinDuration = 3;
  currentColor: string = '';

  private colors = [
    '#7fbc8c',
    '#8c8c8c',
    '#7fb3bc',
    '#bc7f7f',
    '#b57fbc',
    '#bcb77f',
    '#6b5b95',
    '#bc9f7f',
    '#7fbc9f',
    '#bc7fb3',
    '#bcbc7f',
    '#9f7fbc',
    '#7f95bc',
  ];

  ngOnInit() {
    this.setInitialRandomColor();
  }

  setInitialRandomColor() {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    this.currentColor = this.colors[randomIndex];
    this.updateSvgColor();
  }

  updateSvgColor() {
    if (this.diceSvg && this.diceSvg.nativeElement) {
      const svgElements =
        this.diceSvg.nativeElement.querySelectorAll('path, polygon');
      svgElements.forEach((element: SVGElement) => {
        element.style.stroke = this.currentColor;
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
  }

  private stopSpinning() {
    this.isSpinning = false;
    this.diceSvg.nativeElement.classList.remove('spinning');
    this.diceButton.nativeElement.disabled = false;
    this.generateRandomValue();
    this.initiativeRollChange.emit(this.initiativeRoll);
  }

  private generateRandomValue() {
    this.initiativeRoll = Math.floor(Math.random() * 20) + 1;
  }

  getInitiativeScore(): number {
    return this.initiativeRoll + this.initiativeMod;
  }
  onValueChange(value: number | null) {
    if (value === null) {
      return;
    }
    this.initiativeRoll = value;
    this.initiativeRollChange.emit(this.initiativeRoll);
  }
}
