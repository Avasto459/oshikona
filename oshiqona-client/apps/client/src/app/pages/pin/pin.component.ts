import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    // 1. Санҷиш: Оё браузер WebAuthn-ро мефаҳмад?
    if (!window.PublicKeyCredential) {
      alert("Хатогӣ: Браузери шумо биометрияро дастгирӣ намекунад ё сайт дар ҳолати ноамн (HTTP) кушода шудааст.");
      return;
    }

    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    if (available) {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));

      const options: PublicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: { name: "Oshiqona App", id: window.location.hostname },
        user: {
          id: userId,
          name: "user@tcell.tj",
          displayName: "Avesto"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: { 
          authenticatorAttachment: "platform",
          userVerification: "preferred"
        },
        timeout: 60000
      };

      const credential = await navigator.credentials.create({ publicKey: options });
      if (credential) alert("Тасдиқ шуд!");
    } else {
      alert("Дар танзимоти телефон биометрия фаъол нест.");
    }
  } catch (err: any) {
    alert("Хатогии системавӣ: " + err.message);
  }
}
  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
  }
}