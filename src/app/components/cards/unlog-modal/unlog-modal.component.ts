import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemDivider, IonItem, IonTextarea, ModalController ,IonButton , IonModal, IonContent, IonList, IonAvatar, IonLabel, IonHeader, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-unlog-modal',
  templateUrl: './unlog-modal.component.html',
  styleUrls: ['./unlog-modal.component.scss'],
    imports: [IonContent, IonButton]
})
export class UnlogModalComponent  {

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  goToLogin() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/login']);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
