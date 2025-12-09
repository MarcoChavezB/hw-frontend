import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const VAPID_PUBLIC_KEY =
  "BDdhyUalgAd0GeXdy4OtZxLMLPJoRwFtQVFnN5nQoolHSRvz1fo0rzsAUSoy_LU3VqPLinkemGa3odU4RdSce3Y";

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private http = inject(HttpClient);

  async subscribeToPush(authToken: string) {

    //const baseURL = 'http://127.0.0.1:8000/api/';
    const baseURL = 'https://hw-api.on-forge.com/api/';

    //  pide permiso
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Usuario no aceptó notificaciones');
      return;
    }

    // SW listo
    const registration = await navigator.serviceWorker.ready;

    // Crear sub
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const json = subscription.toJSON() as {
      endpoint: string;
      keys: { [key: string]: string };
    };

    if (!json.keys) {
      console.error("La suscripción NO trae keys. Algo falló.");
      return;
    }

    // Mandar al backend
    return this.http.post(
      `${baseURL}push-subscriptions`,
      {
        endpoint: json.endpoint,
        public_key: json.keys["p256dh"],
        auth_token: json.keys["auth"],
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).toPromise();
  }

  private urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }
}
