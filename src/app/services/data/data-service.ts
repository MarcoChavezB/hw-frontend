import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { Comment, Post } from 'src/app/models/Post';
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
  async putChachedPostUser(userId: number, posts: Post[]) {
    try {
      const db = await this.dbPromise;
      await db.put('postData', { id: userId, posts });
    } catch (err) {
      console.error('Error guardando posts por usuario en IndexedDB', err);
    }
  }

  async getCachedPostsUser(userId: number): Promise<Post[] | null> {
    try {
      const db = await this.dbPromise;
      const data = await db.get('postData', userId);
      return data?.posts ?? null;
    } catch (err) {
      console.error('Error leyendo posts por usuario de IndexedDB', err);
      return null;
    }
  }
  
  async putCachedFavoritePosts(userId: number, posts: Post[]) {
    try {
      const db = await this.dbPromise;
      await db.put('postData', { id: userId + 1000000, posts });
    } catch (err) {
      console.error('Error guardando posts favoritos por usuario en IndexedDB', err);
    }
  }
  
  async getCachedFavoritePosts(userId: number): Promise<Post[] | null> {
    try {
      const db = await this.dbPromise;
      const data = await db.get('postData', userId + 1000000);
      return data?.posts ?? null;
    } catch (err) {
      console.error('Error leyendo posts favoritos por usuario de IndexedDB', err);
      return null;
    }
  }
  
  async clearCachedFavoritePosts(userId: number) {
    try {
      const db = await this.dbPromise;
      await db.delete('postData', userId + 1000000);
    } catch (err) {
      console.error('Error eliminando posts favoritos por usuario de IndexedDB', err);
    }
  }
  
  async putCachedSavedPosts(userId: number, posts: Post[]) {
    try {
      const db = await this.dbPromise;
      await db.put('postData', { id: userId + 3000000, posts });
    } catch (err) {
      console.error('Error guardando posts guardados por usuario en IndexedDB', err);
    }
  }
  
  async updateCachedPostComment(postId: number, comment: Comment) {
    try {
      const db = await this.dbPromise;
      const allKeys = await db.getAllKeys('postData');
      for (const key of allKeys) {
        const data = await db.get('postData', key);
        if (data && data.posts) {
          const postIndex = data.posts.findIndex((p: Post) => p.id === postId);
          if (postIndex !== -1) {
            data.posts[postIndex].comments.push(comment);
            await db.put('postData', data);
          }
        }
      }
    } catch (err) {
      console.error('Error actualizando comentario en posts guardados por usuario en IndexedDB', err);
    }
  }
  
  async removeLastCachedPostComment(postId: number) {
    try {
      const db = await this.dbPromise;
      const allKeys = await db.getAllKeys('postData');
      for (const key of allKeys) {
        const data = await db.get('postData', key);
        if (data && data.posts) {
          const postIndex = data.posts.findIndex((p: Post) => p.id === postId);
          if (postIndex !== -1) {
            data.posts[postIndex].comments.pop();
            await db.put('postData', data);
          }
        }
      }
    } catch (err) {
      console.error('Error eliminando último comentario en posts guardados por usuario en IndexedDB', err);
    }
  }

  async getCachedSavedPosts(userId: number): Promise<Post[] | null> {
    try {
      const db = await this.dbPromise;
      const data = await db.get('postData', userId + 3000000);
      return data?.posts ?? null;
    } catch (err) {
      console.error('Error leyendo posts guardados por usuario de IndexedDB', err);
      return null;
    }
  }
  
  /// favoritos
  async clearCachedSavedPosts(userId: number) {
    try {
      const db = await this.dbPromise;
      await db.delete('postData', userId + 3000000);
    } catch (err) {
      console.error('Error eliminando posts guardados por usuario de IndexedDB', err);
    }
  }

  async putCachedLikedPosts(userId: number, posts: Post[]) {
    try {
      const db = await this.dbPromise;
      await db.put('postData', { id: userId + 2000000, posts });
    } catch (err) {
      console.error('Error guardando posts liked por usuario en IndexedDB', err);
    }
  }

    async getCachedLikedPosts(userId: number): Promise<Post[] | null> {
      try {
        const db = await this.dbPromise;
        const data = await db.get('postData', userId + 2000000);
        return data?.posts ?? null;
      } catch (err) {
        console.error('Error leyendo posts liked por usuario de IndexedDB', err);
        return null;
      }
    }

   async clearCachedLikedPosts(userId: number) {
    try {
        const db = await this.dbPromise;
        await db.delete('postData', userId + 2000000);
    } catch (err) {
      console.error('Error eliminando posts liked por usuario de IndexedDB', err);
    }
  }

  async clearCachedPostsUser(userId: number) {
    try {
      const db = await this.dbPromise;
      await db.delete('postData', userId);
    } catch (err) {
      console.error('Error eliminando posts por usuario de IndexedDB', err);
    }
  }


// fyp
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
  
  async putNewPost(post: Post) {
    try {
      const db = await this.dbPromise;
      const data = await db.get('postData', 1);
      if (data && data.posts) {
        data.posts.unshift(post);
        await db.put('postData', data);
      }
    } catch (err) {
      console.error('Error agregando nuevo post en IndexedDB', err);
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
    async clearAllCache() {
      try {
        const db = await this.dbPromise;
    
        const tx = db.transaction(db.objectStoreNames, 'readwrite');
        for (const storeName of db.objectStoreNames) {
          tx.objectStore(storeName).clear(); 
        }
        await tx.done;
    
        console.log('Toda la cache de IndexedDB ha sido eliminada correctamente.');
      } catch (err) {
        console.error('Error eliminando toda la cache:', err);
      }
    }
}
