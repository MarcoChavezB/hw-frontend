import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader ,IonContent, IonToolbar, IonTitle, IonFooter, IonRouterOutlet, IonButtons, IonImg, IonApp, IonMenu, IonMenuButton, IonButton, IonIcon, IonLabel, IonItem, IonList, IonAvatar, IonSearchbar, IonProgressBar } from "@ionic/angular/standalone";
import { UserData } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth/auth-service';
import { DataService } from 'src/app/services/data/data-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonImg, IonApp, IonRouterOutlet, IonTitle, IonToolbar, IonContent, IonFooter, IonButtons],
})
export class HomeComponent implements OnInit  {
  constructor(
  ) { }
  
  router = inject(Router);
  dataService = inject(DataService)
  authService = inject(AuthService)
  user : UserData | null = null; 

  async ngOnInit() {
    this.user =  await this.dataService.obtenerUserData();
  }

    async goTo(route: string, userId?: string) {
      const path = userId ? [route, userId] : [route]; 
      this.router.navigate(path, { 
        replaceUrl: false, 
        state: { animation: { direction: 'forward' } } 
      });
    }

}
