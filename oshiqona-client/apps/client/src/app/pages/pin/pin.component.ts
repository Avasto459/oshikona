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
  biometricType: 'faceid' | 'fingerprint' | 'none' = 'none';

  ngOnInit(): void {
    this.detectDevice();
    this.checkBiometricSupport();
  }

  detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      this.deviceType = 'ios';
      this.biometricType = 'faceid';
    } else if (/android/.test(ua)) {
      this.deviceType = 'android';
      this.biometricType = 'fingerprint';
    } else {
      this.biometricType = 'fingerprint';
    }
  }

  async checkBiometricSupport() {
    if (!window.PublicKeyCredential) {
      this.biometricSupported = false;
      return;
    }
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      this.biometricSupported = available;
    } catch {
      this.biometricSupported = false;
    }
  }

  setTab(tab: 'set' | 'change') {
    this.activeTab = tab;
    this.pin = '';
    this.repeatPin = '';
  }

  /**
   * Биометрияро танзим кунед.
   *
   * Мушкили асосии Vercel:
   *   - rpId бояд бо hostname мувофиқ бошад.
   *   - *.vercel.app доменҳо WebAuthn-ро дастгирӣ мекунанд (аз 2023).
   *   - Агар домени худатон бошад, rpId = hostname-и он.
   *
   * Ин функция rpId-ро аз window.location.hostname автоматӣ мегирад.
   */
  async setupBiometric() {
    if (!this.biometricSupported) {
      alert('Дар ин дастгоҳ биометрия дастгирӣ намешавад.');
      return;
    }

    // rpId бояд точно hostname бошад (бе port, бе protocol)
    const rpId = window.location.hostname;

    // Барои localhost тест: WebAuthn кор мекунад
    // Барои *.vercel.app: кор мекунад (HTTPS + platform authenticator)
    // Барои домени худатон: кор мекунад

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
            { type: 'public-key', alg: -7 },   // ES256
            { type: 'public-key', alg: -257 },  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform', // Танҳо дастгоҳи худ (Face ID / Fingerprint)
            userVerification: 'required',        // Биометрияро ҳатман талаб кун
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: 'none',
        }
      }) as PublicKeyCredential;

      if (credential) {
        // Credential-ро дар localStorage нигоҳ дор (барои demo)
        localStorage.setItem('biometric_credential_id', btoa(
          String.fromCharCode(...new Uint8Array(credential.rawId))
        ));
        alert('Биометрия бомуваффақият танзим шуд!');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        alert('Корбар биометрияро рад кард ё вақт тамом шуд.');
      } else if (err.name === 'InvalidStateError') {
        alert('Биометрия аллакай танзим шудааст.');
      } else if (err.name === 'SecurityError') {
        // Ин хато معمولан рӯй медиҳад агар:
        // 1) HTTP (бе HTTPS) истифода шавад
        // 2) rpId бо hostname мувофиқ набошад
        alert(
          'Хатогии амниятӣ.\n\n' +
          'Сабаб: rpId бо домен мувофиқ нест ё HTTP истифода мешавад.\n' +
          'Домени ҷорӣ: ' + rpId
        );
      } else {
        console.error('WebAuthn хато:', err);
        alert('Хато: ' + err.message);
      }
    }
  }

  /**
   * Биометрияро тасдиқ кунед (login).
   * Барои истифода дар PIN verify экран.
   */
  async verifyBiometric(): Promise<boolean> {
    if (!this.biometricSupported) return false;

    const storedId = localStorage.getItem('biometric_credential_id');
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const allowCredentials: PublicKeyCredentialDescriptor[] = storedId
      ? [{
          type: 'public-key',
          id: Uint8Array.from(atob(storedId), c => c.charCodeAt(0)),
          transports: ['internal'] as AuthenticatorTransport[],
        }]
      : [];

    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: 'required',
          allowCredentials,
          timeout: 60000,
        }
      });
      return !!assertion;
    } catch (err) {
      console.error('Verify хато:', err);
      return false;
    }
  }

  skipBiometrics() {
    console.log('Гузаштан аз биометрия');
    // Дар инҷо навигатсия ба экрани навбатӣ иҷро шавад
  }
}