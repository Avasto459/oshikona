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
    
    if (!available) {
      alert("Дар ин дастгоҳ биометрия фаъол нест ё дастгирӣ намешавад.");
      return;
    }

    // Сохтани Challenge ва ID (барои Android ва iOS муҳим аст)
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const options: PublicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: { 
        name: "Oshiqona App", 
        id: window.location.hostname 
      },
      user: {
        id: userId,
        name: "user@tcell.tj",
        displayName: "Avesto"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },   // ES256 (стандарти асосӣ)
        { alg: -257, type: "public-key" }  // RS256 (барои Android-ҳои кӯҳна)
      ],
      authenticatorSelection: { 
        authenticatorAttachment: "platform",
        userVerification: "preferred", // Ислоҳи муҳим: "preferred" барои Android беҳтар аст
        residentKey: "preferred"
      },
      timeout: 60000
    };

    const credential = await navigator.credentials.create({ publicKey: options });
    
    if (credential) {
      alert("Тасдиқ шуд! Акнун ҳам Face ID ва ҳам Fingerprint бояд кор кунад.");
    }
  } catch (err: any) {
    console.error(err);
    // Ин alert ба мо мегӯяд, ки чаро блок шуд
    alert("Хатогӣ: " + err.name + "\n" + err.message);
  }
}
  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
  }
}