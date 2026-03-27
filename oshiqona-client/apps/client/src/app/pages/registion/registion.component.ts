import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { AvatarCircleComponent } from '@/app/components/avatar-circle.component';
import { DecorativeBlobComponent } from '@/app/components/decorative-blob.component';
import { InputFieldComponent } from '@/app/components/input-field.component';

@Component({
  selector: 'app-registion',
  templateUrl: './registion.component.html',
  styleUrls: ['./registion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarCircleComponent,
    DecorativeBlobComponent,
    InputFieldComponent,
  ],
})
export class RegistionComponent implements OnInit, OnDestroy {
  phone = '+992 112029992';
  password = 'password12345';
  smsCode = '';
  showPassword = false;
  timer = 59;
  isDark = false;

  avatarMain = '/assets/avatar-main.jpg';
  avatar2 = '/assets/avatar-2.jpg';
  avatar3 = '/assets/avatar-3.jpg';
  avatar4 = '/assets/avatar-4.jpg';
  avatar5 = '/assets/avatar-5.jpg';
  tcellLogo = '/assets/tcell-logo.png';

  private timerSubscription?: Subscription;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer() {
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timer > 0))
      .subscribe(() => {
        this.timer--;
      });
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearPhone() {
    this.phone = '';
  }

  clearPassword() {
    this.password = '';
  }

  getTimerText(): string {
    return `00:${this.timer.toString().padStart(2, '0')}`;
  }

  onSubmit() {
    console.log('Form submitted', { phone: this.phone, password: this.password, smsCode: this.smsCode });
  }

  onRegister() {
    console.log('Register clicked');
  }
}
