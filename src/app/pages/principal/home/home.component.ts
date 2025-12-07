import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader, NavController ,IonContent, IonToolbar, IonTitle, IonFooter, IonRouterOutlet, IonButtons, IonImg, IonApp, IonMenu, IonMenuButton, IonButton, IonIcon } from "@ionic/angular/standalone";
import { DataService } from 'src/app/services/data/data-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonIcon, IonButton, IonApp, IonButtons, IonRouterOutlet, IonTitle, IonToolbar, IonHeader, IonContent, IonFooter, IonMenu, IonMenuButton],
})
export class HomeComponent  {

  constructor(
  ) { }
  
  router = inject(Router);
  dataService = inject(DataService)
  

goTo(route: string, userId?: string) {
  const path = userId ? [route, userId] : [route]; 
  this.router.navigate(path, { 
    replaceUrl: false, 
    state: { animation: { direction: 'forward' } } 
  });
}
}
