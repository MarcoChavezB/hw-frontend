// version.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { VersionResponse } from '../models/Version';

@Injectable({ providedIn: 'root' })
export class VersionService {

  private versionInvalidSubject = new BehaviorSubject<boolean>(false);
  public versionInvalid$ = this.versionInvalidSubject.asObservable();

  constructor(private http: HttpClient) {}

  getVersion(): Observable<VersionResponse> {
    return this.http.get<VersionResponse>(environment.versionCheck);
  }

  validateVersion(): Promise<void> {
    return new Promise((resolve) => {
      this.getVersion().subscribe(resp => {
        const current = environment.version;

        if (resp.version !== current) {
          this.versionInvalidSubject.next(true);
        }

        resolve();
      });
    });
  }
}
