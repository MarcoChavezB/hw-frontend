import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { UserData } from 'src/app/models/User';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB() {
    return await openDB('hwAppDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'id' });
        }
      },
    });
  }

  async guardarUserData(data: UserData) {
    const db = await this.dbPromise;
    await db.put('userData', { ...data, id: 1 });
  }

  async obtenerUserData(): Promise<UserData | null> {
    const db = await this.dbPromise;
    const data = await db.get('userData', 1);
    return data ?? null;
  }

  async eliminarUserData() {
    const db = await this.dbPromise;
    await db.delete('userData', 1);
  }

}
