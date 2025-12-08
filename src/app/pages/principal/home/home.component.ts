import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader ,IonContent, IonToolbar, IonTitle, IonFooter, IonRouterOutlet, IonButtons, IonImg, IonApp, IonMenu, IonMenuButton, IonButton, IonIcon, IonLabel, IonItem, IonList, IonAvatar, IonSearchbar, IonProgressBar } from "@ionic/angular/standalone";
import { UserData } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth/auth-service';
import { DataService } from 'src/app/services/data/data-service';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonImg, IonApp, IonRouterOutlet, IonTitle, IonToolbar, IonContent, IonFooter, IonButtons],
})
export class HomeComponent implements OnInit  {
  pushService = inject(PushNotificationService);


  constructor(
  ) { }

  router = inject(Router);
  dataService = inject(DataService)
  authService = inject(AuthService)
  user : UserData | null = null;

  async ngOnInit() {
    console.log("HomeComponent initialized");
    this.user = await this.dataService.obtenerUserData();

    const token = this.user?.token;

    if (!token) {
      console.warn("No hay token, no se puede registrar push");
      return;
    }

    try {
      console.log("Registrando notificaciones push...");
      await this.pushService.subscribeToPush(token);
      console.log("Push registrado con éxito");
    } catch (error) {
      console.error("Error registrando push:", error);
    }
  }



  async goTo(route: string, userId?: string) {
      const path = userId ? [route, userId] : [route];
      this.router.navigate(path, {
        replaceUrl: false,
        state: { animation: { direction: 'forward' } }
      });
    }

}
