import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { AvatarCircleComponent } from '@/app/components/avatar-circle.component';
import { DecorativeBlobComponent } from '@/app/components/decorative-blob.component';
import { InputFieldComponent } from '@/app/components/input-field.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarCircleComponent,
    DecorativeBlobComponent,
    InputFieldComponent,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  phone = '+992 112029992';
  password = 'password12345';
  smsCode = '';
  showPassword = false;
  timer = 59;
  isDark = false;

  avatarMain = '/assets/Rectangle 18.png';
  avatar2 = '/assets/Rectangle 19.png';
  avatar3 = '/assets/Rectangle 20.png';
  avatar4 = '/assets/Rectangle 21.png';
  
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
