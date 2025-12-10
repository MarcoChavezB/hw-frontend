import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular, AlertController } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { APP_INITIALIZER, importProvidersFrom, isDevMode, ApplicationRef } from '@angular/core';
import { provideServiceWorker, SwUpdate } from '@angular/service-worker';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/Interceptor/AuthInterceptor';

bootstrapApplication(AppComponent, {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        importProvidersFrom(HttpClientModule),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideServiceWorker('sw-master.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        AlertController
    ],
})
    .then(async (appRef) => {

        defineCustomElements(window);

        const app = appRef.injector.get(ApplicationRef);
        const swUpdate = appRef.injector.get(SwUpdate, null);
        const alertCtrl = appRef.injector.get(AlertController);

        if (swUpdate && swUpdate.isEnabled) {

            swUpdate.versionUpdates.subscribe(async event => {

                if (event.type === 'VERSION_READY') {

                    console.log('Nueva versión detectada:', event);

                    const alert = await alertCtrl.create({
                        header: 'Actualización disponible',
                        message: 'Hay una nueva versión de la aplicación. Se actualizará ahora.',
                        backdropDismiss: false,
                        keyboardClose: true,
                        buttons: [
                            {
                                text: 'Actualizar',
                                handler: () => {
                                    swUpdate.activateUpdate().then(() => {
                                        document.location.reload();
                                    });
                                }
                            }
                        ]
                    });

                    await alert.present();
                }
            });

            setInterval(() => {
                swUpdate.checkForUpdate()
                    .then(() => console.log('Check for update ejecutado...'))
                    .catch(err => console.warn('Error al buscar actualización:', err));
            }, 60 * 1000);
        }
    })
    .catch(err => console.error(err));
