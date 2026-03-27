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
      // 1. Санҷиши мавҷудияти функсия дар браузер
      if (typeof window.PublicKeyCredential === 'undefined') {
        alert("Браузери шумо биометрияро дастгирӣ намекунад. Лутфан Chrome ё Safari-ро истифода баред.");
        return;
      }

      // 2. Санҷиши фаъол будани биометрия дар телефон
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        alert("Дар танзимоти телефон Face ID ё Fingerprint фаъол нест.");
        return;
      }

      // 3. Тайёр кардани маълумот (Challenge ва ID)
      const challengeBuffer = crypto.getRandomValues(new Uint8Array(32));
      const userIdBuffer = crypto.getRandomValues(new Uint8Array(16));

      // 4. Танзимоти универсалӣ
      const options: PublicKeyCredentialCreationOptions = {
        challenge: challengeBuffer,
        rp: { 
          name: "Oshiqona App", 
          id: window.location.hostname // Ин барои Vercel муҳим аст
        },
        user: {
          id: userIdBuffer,
          name: "user@tcell.tj",
          displayName: "Avesto"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },    // ES256 (барои iOS ва Android)
          { alg: -257, type: "public-key" }   // RS256 (барои баъзе Android-ҳо)
        ],
        authenticatorSelection: { 
          authenticatorAttachment: "platform",
          userVerification: "required", // Маҷбур сохтани Face ID/Fingerprint
          residentKey: "preferred"
        },
        timeout: 60000
      };

      // 5. Иҷрои амалиёт (Намоиши тирезаи Face ID / Fingerprint)
      const credential = await navigator.credentials.create({ publicKey: options });

      if (credential) {
        alert("Муваффақият! Биометрия тасдиқ шуд.");
        // Агар хоҳӣ баъди тасдиқ ба саҳифаи дигар гузарӣ:
        // this.router.navigate(['/home']);
      }

    } catch (err: any) {
      console.error("Biometric Error:", err);
      
      // Хатогиҳои маъмулро ба забони тоҷикӣ мефаҳмонем
      if (err.name === 'NotAllowedError') {
        alert("Шумо тасдиқро рад кардед ё тирезаро пӯшидед.");
      } else if (err.name === 'SecurityError') {
        alert("Хатогии амният: Домени сайт бо танзимот мувофиқ нест.");
      } else {
        alert("Хатогӣ: " + err.message);
      }
    }
  }

  skipBiometrics() {
    console.log('Гузаштан аз танзими биометрия');
    // Ин ҷо метавонӣ navigate кунӣ ба саҳифаи асосӣ
  }
}