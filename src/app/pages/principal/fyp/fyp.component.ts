import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, } from "@ionic/angular/standalone";
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";
import { Post } from 'src/app/models/Post';
import { DataService } from 'src/app/services/data/data-service';
import { PostService } from 'src/app/services/post/post-service';

@Component({
  selector: 'app-fyp',
  templateUrl: './fyp.component.html',
  styleUrls: ['./fyp.component.scss'],
  imports: [IonInfiniteScrollContent, IonInfiniteScroll,IonList, IonContent, PostCardComponent, CommonModule, IonItem],
})
export class FypComponent  implements OnInit {
  posts : Post[] = [];
  postService = inject(PostService);
  dataService = inject(DataService);
  
  ngOnInit() {
    this.fetchPosts();
  }
  
  async fetchPosts() {
    this.posts = await this.dataService.obtenerPostData() || [];
    
    this.postService.getPosts().subscribe({
        next: async (response) => {
            await this.dataService.guardarPostData(response.data);
            this.posts = response.data;
        }, error: (error) => {
            console.log('usando datos cacheados debido a un error en la solicitud:', error);
        }
    })  
  }
  
  onIonInfinite(event: InfiniteScrollCustomEvent) {
  }
  
  likePost(postId: number, post : Post){
    post.already_liked = !post.already_liked;
    post.likes.length += post.already_liked ? 1 : -1;
    this.postService.toggleLikePost(postId).subscribe({
        next: (response) => {
            post.already_liked = response.state;
        },
        error: (error) => {
            console.error('Error toggling like:', error);
            post.already_liked = !post.already_liked;
            post.likes.length += post.already_liked ? 1 : -1;
        }
    });
  }
  
  savePost(postId: number, post: Post){
    post.already_saved = !post.already_saved;
    post.saves.length += post.already_saved ? 1 : -1;
    this.postService.toggleSavePost(postId).subscribe({
        next: (response) => {
            console.log('Post save state toggled:', response);
        },
        error: (error) => {
            console.error('Error toggling save:', error);
            post.already_saved = !post.already_saved;
            post.saves.length += post.already_saved ? 1 : -1;
        }
    });
  }

}
