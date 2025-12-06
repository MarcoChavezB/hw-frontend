import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequest } from 'src/app/models/Post';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PostService {
    http = inject(HttpClient);
    
    getPosts(): Observable<PostRequest>{
        return this.http.get<PostRequest>(environment.fypPosts);
    }
}
