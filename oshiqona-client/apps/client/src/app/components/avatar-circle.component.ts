import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-circle',
  template: `
    <div
      class="absolute rounded-full overflow-hidden animate-sphere"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.top.px]="top"
      [ngStyle]="getStyleObject()"
      [style.border]="border ? '3px solid hsl(var(--primary))' : 'none'"
      [style.animationDelay.s]="delay"
      [style.box-shadow]="boxShadow"
    >
      <img [src]="src" alt="" class="w-full h-full object-cover" />
      <!-- Sphere highlight overlay -->
      <div
        class="absolute inset-0 rounded-full pointer-events-none"
        style="background: radial-gradient(ellipse 60% 40% at 35% 25%, rgba(255,255,255,0.35) 0%, transparent 70%)"
      ></div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class AvatarCircleComponent {
  @Input() src!: string;
  @Input() size!: number;
  @Input() top!: number;
  @Input() left!: number | string;
  @Input() border = false;
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

  get boxShadow(): string {
    if (this.border) {
      return '0 8px 32px rgba(130, 30, 190, 0.3), inset 0 -4px 12px rgba(0,0,0,0.15), inset 0 4px 12px rgba(255,255,255,0.2)';
    }
    return '0 4px 16px rgba(130, 30, 190, 0.15), inset 0 -3px 8px rgba(0,0,0,0.1), inset 0 3px 8px rgba(255,255,255,0.15)';
  }
}
