import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../services/data/data-service';

export const authInterceptor: (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>> =
  (req, next) => {
    const dataService = inject(DataService);

    return from(dataService.obtenerUserData()).pipe(
      switchMap(userData => {
        const token = userData?.token;
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;
        return next(authReq);
      })
    );
  };
