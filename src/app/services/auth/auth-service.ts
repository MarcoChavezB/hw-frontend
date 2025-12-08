import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/models/User';
import { environment } from 'src/environments/environment.prod';
import { DataService } from '../data/data-service';
import { ToggleResponse } from 'src/app/models/Post';
import { VersionReadyEvent } from '@angular/service-worker';
import { VersionResponse } from 'src/app/models/Version';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    http = inject(HttpClient);
    dataService = inject(DataService);

    async isAuthenticated(): Promise<boolean> {
        return await this.dataService.obtenerUserData().then(userData => !!userData);
    }

    login(email: string, password: string, reCaptcha_token: string): Observable<UserData> {
        return this.http.post<UserData>(environment.userLogin, { email, password, reCaptcha_token });
    }

    register(name: string, email: string, password: string, password_confirmation: string, preferred_name: string, reCaptcha_token: string, phone_number: string): Observable<any> {
        return this.http.post<any>(environment.userRegister, { name, email, password, password_confirmation, preferred_name, reCaptcha_token, phone_number });
    }

    verifyEmail(email: string, totp: string, reCaptcha_token: string): Observable<any> {
        return this.http.post<any>(environment.verifyEmail, { email, totp, reCaptcha_token });
    }

    getUserProfileData(userId: number): Observable<UserData> {
        return this.http.get<UserData>(environment.getUserProfileData(userId));
    }

    getUserNamesList(): Observable<string[]> {
        return this.http.get<string[]>(environment.getUserNamesList);
    }

    toggleFollowUser(userId: number): Observable<ToggleResponse> {
        return this.http.post<ToggleResponse>(environment.toggleFollowUser(userId), {});
    }
}
