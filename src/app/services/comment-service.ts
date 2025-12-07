import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CommentResponse } from '../models/Post';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
    http = inject(HttpClient);
    
    addComment(postId: number, content: string): Observable<CommentResponse> {
        return this.http.post<CommentResponse>(environment.postCommentStore(postId), { content });
    }
}
