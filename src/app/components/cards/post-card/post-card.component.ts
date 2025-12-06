import { CommonModule } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';
import { IonItem, IonButton, IonIcon, IonCard, IonAvatar, IonLabel, IonChip, IonCardContent, IonImg, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { formatDate } from '@angular/common';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  imports: [IonCol, IonRow, IonGrid, IonImg, IonCardContent, IonChip, IonLabel, IonAvatar, IonButton, IonCard, IonItem, CommonModule],
})
export class PostCardComponent {
  @Input() avatar: string = '';
  @Input() username: string = '';
  @Input() location: string = '';
  @Input() image: string = '';
  @Input() content: string = '';
  @Input() likes : number = 0;
  @Input() comments : number = 0;
  @Input() hashtags: string[] = []; 

  localImage: string = ''; // ruta local para el <img>

  async ngOnInit() {
    if (this.image) {
      await this.loadImage(this.image);
    }
  }

async loadImage(url: string) {
  try {
    const filename = this.hashCode(url) + '.jpg';

    // Intentamos leer archivo local
    const file = await Filesystem.readFile({
      path: filename,
      directory: Directory.Data
    }).catch(() => null);

    if (file) {
      // Ya existe localmente → usamos directamente
      this.localImage = `data:image/jpeg;base64,${file.data}`;
      return; // <-- muy importante, salimos antes de fetch
    }

    // Si no existe localmente → descargamos
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = (await this.convertBlobToBase64(blob)) as string;
    const base64Data = base64.split(',')[1];

    await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Data
    });

    this.localImage = `data:image/jpeg;base64,${base64Data}`;
  } catch (error) {
    console.warn('No se pudo descargar la imagen, se mostrará local si existe:', error);
  }
}


  convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  hashCode(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convertir a 32bit
    }
    return hash.toString();
  }
}
