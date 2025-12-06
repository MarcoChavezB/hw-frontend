import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: string[] = [];

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 90,
    });

    this.photos.unshift(capturedPhoto.dataUrl!);
  }
  
  webPhoto: string | null = null;

  async takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });

      this.webPhoto = photo.dataUrl!;
      localStorage.setItem('latestPhoto', this.webPhoto);
    } catch (err) {
      console.log("Error al tomar foto", err);
    }
  }

}