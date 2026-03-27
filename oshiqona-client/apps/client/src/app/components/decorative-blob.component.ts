import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-decorative-blob',
  template: `
    <div
      class="absolute rounded-full bg-primary animate-sphere"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.top.px]="top"
      [ngStyle]="getStyleObject()"
      [style.opacity]="opacity"
      [style.filter]="blur ? 'blur(20px)' : 'none'"
      [style.animationDelay.s]="delay"
    ></div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class DecorativeBlobComponent {
  @Input() size!: number;
  @Input() top!: number;
  @Input() left!: number | string;
  @Input() opacity!: number;
  @Input() blur = false;
  @Input() delay = 0;

  getStyleObject() {
    const style: any = {};
    if (typeof this.left === 'number') {
      style['left.px'] = this.left;
    } else if (typeof this.left === 'string') {
      style['left'] = this.left;
    }
    return style;
  }
}
