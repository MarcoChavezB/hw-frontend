import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { APP_INITIALIZER, importProvidersFrom, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/Interceptor/AuthInterceptor';
import { VersionService } from './app/services/version-service';
export function versionInitializer(versionService: VersionService) {
  return () => versionService.validateVersion();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: versionInitializer,
      deps: [VersionService],
    },
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
})
.then(() => {
  defineCustomElements(window);
});
