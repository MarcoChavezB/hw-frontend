import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraWebService {

  private stream: MediaStream | null = null;
  private facingMode: 'user' | 'environment' = 'environment';

  public lastPhoto = new BehaviorSubject<string | null>(null);

  public cameraStream$ = new BehaviorSubject<MediaStream | null>(null);

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode }
      });
      this.cameraStream$.next(this.stream);
      return this.stream;
    } catch (err) {
      console.error('Error al iniciar cámara: ', err);
      throw err;
    }
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.cameraStream$.next(null);
  }

  switchCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopCamera();
    return this.startCamera();
  }

capturePhoto(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    this.lastPhoto.next(base64);
    localStorage.setItem('latestPhoto', base64);

    this.stopCamera();

    video.srcObject = null;

    return base64;
}


  handleFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.lastPhoto.next(base64);
        localStorage.setItem('latestPhoto', base64);
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  getFacingMode() {
    return this.facingMode;
  }
}
