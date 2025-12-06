import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonItem, IonButton, IonIcon, IonCard, IonAvatar, IonLabel, IonChip, IonCardContent, IonImg, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { formatDate } from '@angular/common';

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

}
