import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-field',
  template: `
    <div class="relative h-[62px]">
      <label class="absolute -top-[3px] left-0 text-sm tracking-tight text-foreground block">
        {{ label }}
      </label>
      <div class="absolute top-[18px] left-0 right-0 h-11 rounded-[22px] border border-border bg-[hsl(var(--phone-bg))]">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class InputFieldComponent {
  @Input() label!: string;
}
