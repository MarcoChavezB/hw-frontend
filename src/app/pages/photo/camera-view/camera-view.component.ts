import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CameraWebService } from 'src/app/services/camera-web-service';
import { IonContent, NavController } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-camera-view',
    templateUrl: './camera-view.component.html',
    styleUrls: ['./camera-view.component.scss'],
    imports: [IonContent, CommonModule],
})
export class CameraViewComponent implements OnInit, OnDestroy {

    @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

    stream: MediaStream | null = null;

    showTakePhoto: boolean = true;

    constructor(
        private navCtrl: NavController,
        private cameraService: CameraWebService
    ) { }
    ngOnInit() {
        this.startCamera();
        this.cameraService.cameraStream$.subscribe(stream => {
            this.stream = stream;
            if (stream && this.videoRef?.nativeElement) {
                this.videoRef.nativeElement.srcObject = stream;
                this.videoRef.nativeElement.play().then(() => {
                    // Una vez que el video comienza a reproducirse, habilitamos el botón de captura
                    this.showTakePhoto = true;
                });
            }
        });
    }



    ngOnDestroy(): void {
        this.stopCamera();
    }

    async startCamera() {
        try {
            this.showTakePhoto = false;
            await this.cameraService.startCamera();
        } catch {
            alert('No se pudo acceder a la cámara.');
        }
    }
    switchCamera() {
        this.cameraService.switchCamera();
    }

    stopCamera() {
        this.cameraService.stopCamera();
    }

    close() {
        this.stopCamera();
        this.navCtrl.back();
    }

    openGallery() {
        this.fileInputRef.nativeElement.click();
    }

    handleFile(event: any) {
        const file = event.target.files[0];
        if (!file) return;
        this.cameraService.handleFile(file).then(() => {
            this.navCtrl.navigateForward('/home/upload');
        });
    }

    capturePhoto() {
        if (!this.showTakePhoto) return;

        if (!this.videoRef?.nativeElement || !this.canvasRef?.nativeElement) return;

        this.cameraService.capturePhoto(
            this.videoRef.nativeElement,
            this.canvasRef.nativeElement
        );

        this.cameraService.stopCamera();

        this.videoRef.nativeElement.srcObject = null;

        this.navCtrl.navigateForward('/home/upload', { animated: true });
    }
}
