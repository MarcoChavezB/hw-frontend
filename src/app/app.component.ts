import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, AlertController, IonAlert } from '@ionic/angular/standalone';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonAlert, IonApp, IonRouterOutlet],
})
export class AppComponent {
}
