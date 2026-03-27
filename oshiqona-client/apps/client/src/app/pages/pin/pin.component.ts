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
      if (!window.PublicKeyCredential) {
        alert("Браузери шумо WebAuthn-ро дастгирӣ намекунад. Chrome-ро истифода баред.");
        return;
      }

      const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!isAvailable) {
        alert("Дар телефонатон биометрия (ангушт/рӯй) фаъол нест.");
        return;
      }

      const options: PublicKeyCredentialCreationOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: "Oshiqona", id: window.location.hostname },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: "avesto@oshiqona.tj",
          displayName: "Avesto"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          residentKey: "preferred"
        },
        timeout: 60000
      };

      const credential = await navigator.credentials.create({ publicKey: options });
      if (credential) {
        alert("Тасдиқ шуд! Акнун шумо метавонед ворид шавед.");
        this.router.navigate(['/home']);
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        alert("Шумо тирезаро бастед ё рад кардед.");
      } else {
        alert("Хатогӣ: " + err.message);
      }
    }
  }

  skipBiometrics() {
    this.router.navigate(['/home']);
  }
} // Қавси ниҳоии класс