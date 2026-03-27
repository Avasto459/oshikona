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
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    if (available) {
      // Android талаб мекунад, ки Challenge ва User ID ҳатман Buffer бошанд
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));

      const options: PublicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: { 
          name: "Oshiqona App", 
          id: window.location.hostname // Боварӣ ҳосил кун, ки дар HTTPS ҳастӣ
        },
        user: {
          id: userId,
          name: "avesta@tcell.tj",
          displayName: "Avesto"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" } // RS256 барои баъзе Android-ҳо
        ],
        authenticatorSelection: { 
          authenticatorAttachment: "platform",
          userVerification: "required", // Барои Android ин муҳим аст
          residentKey: "preferred"
        },
        timeout: 60000
      };

      const credential = await navigator.credentials.create({ publicKey: options });
      
      if (credential) {
        alert("Биометрия дар Android тасдиқ шуд!");
      }
    } else {
      alert("Дар ин телефон биометрия (изи ангушт ё рӯй) ёфт нашуд ё фаъол нест.");
    }
  } catch (err: any) {
    console.error(err);
    // Ин alert ба ту мегӯяд, ки маҳз чӣ хато дорад
    alert("Хатогӣ дар Android: " + err.message);
  }
}
  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
  }
}