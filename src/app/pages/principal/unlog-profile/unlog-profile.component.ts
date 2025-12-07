import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonSegment, IonSegmentButton, IonItem, IonCol, IonRow, IonContent, IonAvatar, IonGrid, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-unlog-profile',
  templateUrl: './unlog-profile.component.html',
  styleUrls: ['./unlog-profile.component.scss'],
  imports: [IonButton, IonGrid, IonAvatar, IonContent, IonItem, IonRow, IonCol, IonSegment, IonSegmentButton]
})
export class UnlogProfileComponent  implements OnInit {
  router = inject(Router);
  constructor() { }

  ngOnInit() {}
  goToLogin(){
    this.router.navigate(['/login']);
  }
  
  goToHome(){
    this.router.navigate(['/']);
  }
  
  

}
