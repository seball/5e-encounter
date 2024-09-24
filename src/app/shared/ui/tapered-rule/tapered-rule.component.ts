import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-tapered-rule',
  templateUrl: './tapered-rule.component.html',
  styleUrls: ['./tapered-rule.component.scss'],
  standalone: true,
})
export class TaperedRuleComponent implements OnInit {
  screenWidth: number = window.innerWidth;

  ngOnInit() {
    this.calculateScreenWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateScreenWidth();
  }

  calculateScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  getPolylinePoints(): string {
    const width = this.screenWidth * 0.5; // 50% of the screen width
    return `0,0 ${width},2.5 0,5`;
  }
}
