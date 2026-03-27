import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Барои гузаштан ба саҳифаи дигар

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

  constructor(private router: Router) {} // Илова кардани Router

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
      // 1. Санҷиши амният: Оё браузер WebAuthn-ро мефаҳмад?
      if (!window.PublicKeyCredential) {
        alert("Лутфан сайтро дар Chrome (Android) ё Safari (iOS) кушоед. Браузери ҳозира биометрияро дастгирӣ намекунад.");
        return;
      }

      // 2. Санҷиш: Оё дар телефон биометрия фаъол аст?
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (!available) {
        alert("Дар танзимоти телефонатон Face ID ё Fingerprint-ро фаъол кунед.");
        return;
      }

      // 3. Сохтани маълумоти амниятӣ (Challenge)
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));

      // 4. Танзимот барои ҳам Android ва ҳам iOS
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
          { alg: -7, type: "public-key" },   // ES256 (стандарти iOS ва Android)
          { alg: -257, type: "public-key" }  // RS256 (барои телефонҳои кӯҳна)
        ],
        authenticatorSelection: { 
          authenticatorAttachment: "platform",
          userVerification: "required", // "required" маҳз Face ID-ро дар iPhone маҷбур мекунад
          residentKey: "preferred"
        },
        timeout: 60000
      };

      // 5. ДАЪВАТИ ТИРЕЗАИ СИСТЕМАВӢ (Face ID ё Fingerprint)
      const credential = await navigator.credentials.create({ publicKey: options });
      
      if (credential) {
        alert("Табрик! Биометрия бо муваффақият тасдиқ шуд.");
        // Ин ҷо метавонӣ корбарро ба саҳифаи асосӣ равон кунӣ
        // this.router.navigate(['/home']); 
      }

    } catch (err: any) {
      console.error("Biometric error:", err);
      // Агар корбар худаш тирезаро пӯшад (Cancel пахш кунад)
      if (err.name === 'NotAllowedError') {
        console.log("Корбар тасдиқро рад кард.");
      } else {
        alert("Хатогии техникӣ: " + err.message);
      }
    }
  }

  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
    // Ин ҷо ҳам метавонӣ navigate кунӣ
  }
}