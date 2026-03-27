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
      // Истифодаи crypto барои Challenge ва User ID (барои Android муҳим аст)
      const challengeBuffer = crypto.getRandomValues(new Uint8Array(32));
      const userIdBuffer = crypto.getRandomValues(new Uint8Array(16));

      const options: PublicKeyCredentialCreationOptions = {
        challenge: challengeBuffer,
        rp: { 
          name: "Oshiqona App", 
          id: window.location.hostname // Ин ба таври автоматӣ домени Vercel-ро мегирад
        },
        user: {
          id: userIdBuffer,
          name: "avesta@tcell.tj",
          displayName: "Avesto"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },   // ES256 (барои iOS/Android)
          { alg: -257, type: "public-key" }  // RS256 (барои баъзе Android-ҳо)
        ],
        authenticatorSelection: { 
          authenticatorAttachment: "platform",
          userVerification: "required", // Барои Face ID-и iPhone ҳатмист
          residentKey: "preferred"
        },
        timeout: 60000
      };

      const credential = await navigator.credentials.create({ publicKey: options });
      
      if (credential) {
        alert("Табрик! Биометрия бо муваффақият тасдиқ шуд.");
      }
    } else {
      alert("Дар ин дастгоҳ биометрия ёфт нашуд. Боварӣ ҳосил кунед, ки Face ID ё Fingerprint дар танзимоти телефон фаъол аст.");
    }
  } catch (err: any) {
    console.error("Biometric Error:", err);
    // Ин alert ба мо мегӯяд, ки чаро iPhone ё Android онро блок кард
    alert("Хатогии биометрия: " + err.message);
  }
}
  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
  }
}