import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {
  activeTab: 'set' | 'change' = 'set';
  pin: string = '';
  repeatPin: string = '';
  deviceType: 'ios' | 'android' | 'web' = 'web';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.detectDevice();
  }

  detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      this.deviceType = 'ios';
    } else if (/android/.test(ua)) {
      this.deviceType = 'android';
    }
  }

  setTab(tab: 'set' | 'change') {
    this.activeTab = tab;
    this.pin = '';
    this.repeatPin = '';
  }
async handleBiometric(type: string) {
  try {
    // 1. Санҷиши мавҷудият
    if (!window.PublicKeyCredential) {
      alert("Браузери шумо WebAuthn-ро дастгирӣ намекунад. Chrome-ро истифода баред.");
      return;
    }

    // 2. Санҷиши дастгирии платформа (Android/iOS)
    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!isAvailable) {
      alert("Дар телефонатон биометрия (ангушт/рӯй) фаъол нест ё дастгирӣ намешавад.");
      return;
    }

    // 3. Танзимоти махсус барои Android Chrome
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const options: PublicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: { 
        name: "Oshiqona", 
        id: window.location.hostname // Ин муҳим аст, ки маҳз домени Vercel бошад
      },
      user: {
        id: userId,
        name: "avesto@oshiqona.tj",
        displayName: "Avesto"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },   // ES256 (стандарт барои Android)
        { alg: -257, type: "public-key" }  // RS256 (барои моделҳои кӯҳна)
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred", // ДИҚҚАТ: "preferred" дар Android беҳтар кор мекунад
        residentKey: "preferred"
      },
      timeout: 60000
    };

    // 4. Даъвати тиреза
    const credential = await navigator.credentials.create({ publicKey: options });

    if (credential) {
      alert("Тасдиқ шуд! Акнун шумо метавонед ворид шавед.");
      // this.router.navigate(['/home']);
    }

  } catch (err: any) {
    console.error(err);
    if (err.name === 'NotAllowedError') {
      alert("Шумо тирезаро бастед ё рад кардед.");
    } else {
      alert("Хатогӣ дар Android: " + err.message);
    }
  }
}

  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
    // Ин ҷо метавонӣ navigate кунӣ ба саҳифаи асосӣ
  }
}