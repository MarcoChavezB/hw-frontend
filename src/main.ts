import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

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
        })
    ],
})
    .then((appRef) => {
        defineCustomElements(window);

        const app = appRef.injector.get(ApplicationRef);
        const swUpdate = appRef.injector.get(SwUpdate, null);

        if (swUpdate && swUpdate.isEnabled) {

            swUpdate.versionUpdates.subscribe(event => {
                if (event.type === 'VERSION_READY') {
                    console.log('Nueva versión detectada:', event);

                    const update = confirm('Hay una nueva versión disponible. ¿Deseas actualizar?');

                    if (update) {
                        swUpdate.activateUpdate().then(() => {
                            document.location.reload();
                        });
                    }
                }
            });

            setInterval(() => {
                swUpdate.checkForUpdate()
                    .then(() => console.log('🔍 Check for update ejecutado...'))
                    .catch(err => console.warn('⚠️ Error al buscar actualización:', err));
            }, 60 * 1000);
        }
    })
    .catch(err => console.error(err));
