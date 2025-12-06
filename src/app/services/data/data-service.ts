import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { Post } from 'src/app/models/Post';
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
      return await openDB('hwAppDB', 2, { 
        upgrade(db, oldVersion, newVersion, transaction) {
          if (!db.objectStoreNames.contains('userData')) {
            db.createObjectStore('userData', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('postData')) {
            db.createObjectStore('postData', { keyPath: 'id' });
          }
        },
      });
    }


  // ==========================
  // Usuario
  // ==========================

  async guardarUserData(data: UserData) {
    try {
      const db = await this.dbPromise;
      await db.put('userData', { ...data, id: 1 });
    } catch (err) {
      console.error('Error guardando userData en IndexedDB', err);
    }
  }

  async obtenerUserData(): Promise<UserData | null> {
    try {
      const db = await this.dbPromise;
      const data = await db.get('userData', 1);
      return data ?? null;
    } catch (err) {
      console.error('Error leyendo userData de IndexedDB', err);
      return null;
    }
  }

  async eliminarUserData() {
    try {
      const db = await this.dbPromise;
      await db.delete('userData', 1);
    } catch (err) {
      console.error('Error eliminando userData de IndexedDB', err);
    }
  }

  // ==========================
  // Posts
  // ==========================

  async guardarPostData(posts: Post[]) {
    try {
      const db = await this.dbPromise;
      await db.put('postData', { id: 1, posts });
    } catch (err) {
      console.error('Error guardando posts en IndexedDB', err);
    }
  }

  async obtenerPostData(): Promise<Post[] | null> {
    try {
      const db = await this.dbPromise;
      const data = await db.get('postData', 1);
      return data?.posts ?? null;
    } catch (err) {
      console.error('Error leyendo posts de IndexedDB', err);
      return null;
    }
  }

  async clearPostData() {
    try {
      const db = await this.dbPromise;
      await db.delete('postData', 1);
    } catch (err) {
      console.error('Error eliminando posts de IndexedDB', err);
    }
  }
}
