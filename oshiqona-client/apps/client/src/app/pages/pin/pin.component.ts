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
  biometricSupported = false;

  ngOnInit(): void {
    this.detectDevice();
    this.checkBiometricSupport();
  }

  detectDevice() {
    const ua = navigator.userAgent.toLowerCase();

    const isIOS =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const isAndroid = /android/.test(ua);

    if (isIOS) {
      this.deviceType = 'ios';
    } else if (isAndroid) {
      this.deviceType = 'android';
    } else {
      this.deviceType = 'web';
    }
  }

  async checkBiometricSupport() {
    if (!window.PublicKeyCredential) {
      this.biometricSupported = false;
      return;
    }
    try {
      this.biometricSupported =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      this.biometricSupported = false;
    }
  }

  setTab(tab: 'set' | 'change') {
    this.activeTab = tab;
    this.pin = '';
    this.repeatPin = '';
  }

  async setupBiometric(type: 'faceid' | 'fingerprint') {
    if (!this.biometricSupported) {
      alert('Дар ин дастгоҳ биометрия дастгирӣ намешавад.');
      return;
    }

    const rpId = window.location.hostname;
    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'Tcell Messenger',
            id: rpId,
          },
          user: {
            id: userId,
            name: 'user@tcell.tj',
            displayName: 'Корбар',
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: 'none',
        }
      }) as PublicKeyCredential;

      if (credential) {
        localStorage.setItem(
          'biometric_credential_id',
          btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        );
        alert('Биометрия бомуваффақият танзим шуд!');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        alert('Биометрия рад карда шуд ё вақт тамом шуд.');
      } else if (err.name === 'InvalidStateError') {
        alert('Биометрия аллакай танзим шудааст.');
      } else if (err.name === 'SecurityError') {
        alert('Хатогии амниятӣ: домен бо rpId мувофиқ нест ё HTTP истифода мешавад.');
      } else {
        alert('Хато: ' + err.message);
      }
    }
  }

  skipBiometrics() {
    console.log('Гузаштан аз биометрия');
    // навигатсия ба экрани навбатӣ
  }
}