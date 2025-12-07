import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hashtag, HashtagResponse } from 'src/app/models/Hashtag';
import { PostRequest, ToggleResponse } from 'src/app/models/Post';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PostService {
    http = inject(HttpClient);
    
    getPosts(): Observable<PostRequest>{
        return this.http.get<PostRequest>(environment.fypPosts);
    }
    
    getHastags(): Observable<HashtagResponse> {
        return this.http.get<HashtagResponse>(environment.hashtags);
    }
    
    createPost(data: any): Observable<any>{
        return this.http.post<any>(environment.createPost, data);
    }
    
    toggleLikePost(postId: number): Observable<ToggleResponse> {
        const url = environment.toggleLikePost(postId);
        return this.http.post<ToggleResponse>(url, {});
    }

    toggleSavePost(postId: number): Observable<ToggleResponse> {
        const url = environment.toggleSavePost(postId);
        return this.http.post<ToggleResponse>(url, {});
    }
}
