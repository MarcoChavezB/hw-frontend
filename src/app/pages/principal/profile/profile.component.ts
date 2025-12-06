import { Component, OnInit } from '@angular/core';
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";
import { IonContent, IonAvatar, IonButton, IonItem, IonList } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [IonList, IonItem, IonButton, IonAvatar, IonContent, IonContent, IonButton, IonItem, IonList, PostCardComponent, IonAvatar, CommonModule]
})
export class ProfileComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}


  user = {
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Carlos Mendoza',
    preferred: 'carlosmx',
    bio: 'Desarrollador full-stack • Amante del café ☕ • Viajero 🌎'
  };

  posts = [
    {
      content: 'Un gran día para escribir código 💻✨',
      image: 'https://picsum.photos/600?1',
      location: 'Guadalajara'
    },
    {
      content: 'Nada como un café por la mañana ☕',
      image: 'https://picsum.photos/600?2',
      location: 'Ciudad de México'
    },
    {
      content: 'Explorando lugares nuevos',
      image: 'https://picsum.photos/600?3',
      location: 'Monterrey'
    }
  ];

}
