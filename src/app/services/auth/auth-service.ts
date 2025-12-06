import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/models/User';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  
  login(email: string, password: string): Observable<UserData> {
    return this.http.post<UserData>(environment.userLogin, { email, password });
  }
}
