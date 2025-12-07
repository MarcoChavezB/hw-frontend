import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, AlertController, IonAlert } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from "./explore-container/explore-container.component";
import { VersionService } from './services/version-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonAlert, IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(
    private alertCtrl: AlertController,
    private versionService: VersionService
  ) {
    this.subscribeToVersionAlerts();
  }

  subscribeToVersionAlerts() {
    this.versionService.versionInvalid$.subscribe(async (invalid) => {
      if (invalid) {
        const alert = await this.alertCtrl.create({
          header: "Nueva versión disponible!",
          message: "Hay una nueva versión de la aplicación. Por favor, actualiza para continuar usando la última versión.",
          buttons: [
            {
              text: 'Actualizar',
              role: 'confirm',
              handler: () => {
                window.location.reload(); 
              }
            }
          ]
        });

        await alert.present();
      }
    });
  }
}