import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { DataService } from '../services/data/data-service';
import { AuthService } from '../services/auth/auth-service';

export const authInterceptor: (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>> =
    (req, next) => {
        const dataService = inject(DataService);
        const authService = inject(AuthService);

        return from(dataService.obtenerUserData()).pipe(
            switchMap(userData => {
                const token = userData?.token;
                const authReq = token
                    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                    : req;
                return next(authReq);
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    authService.logout();
                }
                return throwError(() => error);
            })
        );
    };