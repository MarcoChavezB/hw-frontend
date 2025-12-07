import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonButton, IonIcon, IonCard, ModalController ,IonAvatar, IonLabel, IonChip, IonCardContent, IonImg, IonGrid, IonRow, IonCol, IonItemDivider } from "@ionic/angular/standalone";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FormsModule } from '@angular/forms';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';
import { Comment } from 'src/app/models/Post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  imports: [IonCardContent, IonChip, IonLabel, IonAvatar, IonButton, IonCard, IonItem, CommonModule, FormsModule],
})
export class PostCardComponent {
  constructor(
    private modalCtrl : ModalController
  ) { }
  @Input() postId: number = 0;
  @Input() avatar: string = '';
  @Input() username: string = '';
  @Input() location: string = '';
  @Input() image: string = '';
  @Input() content: string = '';
  @Input() likes : number = 0;
  @Input() comments : number = 0;
  @Input() favorites : number = 0;
  @Input() hashtags: string[] = []; 
  @Input() title: string = '';
  @Input() liked : boolean = false;
  @Input() favorite : boolean = false;
  @Input() commentsData: Comment[] = [];
  
  @Output() likeEvent = new EventEmitter<boolean>();
  @Output() favoriteEvent = new EventEmitter<boolean>();


  localImage: string = ''; 

  async ngOnInit() {
    if (this.image) {
      await this.loadImage(this.image);
    }
  }

async loadImage(url: string) {
  try {
    const filename = this.hashCode(url) + '.jpg';

    const file = await Filesystem.readFile({
      path: filename,
      directory: Directory.Data
    }).catch(() => null);

    if (file) {
      this.localImage = `data:image/jpeg;base64,${file.data}`;
      return;
    }

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
      hash |= 0;
    }
    return hash.toString();
  }
  
  
  like(){
    this.likeEvent.emit(this.liked);
  }
  
  fav(){
    this.favoriteEvent.emit(this.favorite);
  }
  
  async openCommentsModal(){
    const modal = await this.modalCtrl.create({
        component: CommentsModalComponent,
          presentingElement: document.querySelector('ion-router-outlet')!,
          cssClass: 'comments-modal',
          componentProps: {
            comments: this.commentsData,
            postId: this.postId
          }
    });
    await modal.present();
  }
}
