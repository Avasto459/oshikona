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

  async handleBiometric() {
    try {
      if (!window.PublicKeyCredential) {
        alert("Браузер биометрияро дастгирӣ намекунад");
        return;
      }

      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      if (!available) {
        alert("Face ID ё Fingerprint дар телефон фаъол нест");
        return;
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "Oshiqona App"
          },
          user: {
            id: userId,
            name: "user@oshiqona.tj",
            displayName: "User"
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "none"
        }
      });

      if (credential) {
        alert("Муффақият! 🎉");
        this.router.navigate(['/home']);
      }

    } catch (err: any) {
      console.error(err);

      if (err.name === 'NotAllowedError') {
        alert("Шумо рад кардед ё бекор кардед");
      } else {
        alert("Хатогӣ: " + err.message);
      }
    }
  }

  skipBiometrics() {
    this.router.navigate(['/home']);
  }
}