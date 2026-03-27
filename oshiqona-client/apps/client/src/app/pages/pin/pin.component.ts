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
    // 1. Санҷиш: Оё дастгоҳ биометрия дорад?
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    if (available) {
      // 2. Сохтани "Challenge" (код барои бехатарӣ)
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // 3. Танзимоти WebAuthn барои даъвати тирезаи СИСТЕМАВӢ
      const options: PublicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: { name: "Oshiqona App", id: window.location.hostname },
        user: {
          id: new Uint8Array([1, 2, 3, 4]),
          name: "avesta@tcell.tj",
          displayName: "Avesto"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform" },
        timeout: 60000
      };

      // 4. ДАЪВАТИ ТИРЕЗАИ ҲАҚИҚӢ (ИН ҶО ТИРЕЗАИ FACE ID МЕБАРОЯД)
      const credential = await navigator.credentials.create({ publicKey: options });
      
      if (credential) {
        alert("Табрик! Биометрия тасдиқ шуд.");
      }
    } else {
      alert("Дар ин дастгоҳ биометрия ёфт нашуд.");
    }
  } catch (err) {
    console.error(err);
    alert("Хатогӣ: Барои биометрия HTTPS лозим аст!");
  }
}
  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
  }
}