import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  getLocation(): Promise<{ lat: number, lon: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        () => {
          resolve(null);
        },
        {
          enableHighAccuracy: false,
        }
      );
    });
  }

  async getLocationName(): Promise<string> {
    const coords = await this.getLocation();

    if (!coords) return "No se pudo obtener la ubicación.";

    const { lat, lon } = coords;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );

      const data = await response.json();

      const name =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.hamlet ||
        data.address.county ||
        data.display_name;

      return name ? name : "Ubicación no encontrada.";
    } catch (err) {
      return "Error obteniendo el nombre de la ubicación.";
    }
  }
}
