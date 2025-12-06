import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader, IonContent, IonToolbar, IonTitle, IonFooter, IonRouterOutlet, IonButtons, IonImg, IonApp, IonMenu, IonMenuButton, IonButton, IonIcon } from "@ionic/angular/standalone";
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonIcon, IonButton, IonApp, IonButtons, IonRouterOutlet, IonTitle, IonToolbar, IonHeader, IonContent, IonFooter, IonMenu, IonMenuButton],
})
export class HomeComponent  implements OnInit {

  constructor() { }
  
  router = inject(Router);
  photoService = inject(PhotoService);
  
  ngOnInit() {}

    goTo(route: string){
        this.router.navigate([`/${route}`]);
    }
    
    takePhoto(){
        this.photoService.takePhoto();
    }
}
