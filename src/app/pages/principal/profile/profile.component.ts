import { Component, inject, OnInit } from '@angular/core';
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";
import { IonContent, IonAvatar, IonButton, IonItem, IonList } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Post, User } from 'src/app/models/Post';
import { PostService } from 'src/app/services/post/post-service';
import { DataService } from 'src/app/services/data/data-service';
import { UserData } from 'src/app/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [IonList, IonItem, IonButton, IonAvatar, IonContent, IonContent, IonButton, IonItem, IonList, PostCardComponent, IonAvatar, CommonModule]
})
export class ProfileComponent  implements OnInit {

    posts : Post[] = [];
    postService = inject(PostService);
    dataService = inject(DataService);
    userId: number = 0;
    user : UserData | null = null; 
  constructor() { }

  ngOnInit() {
    this.getMyPosts();
    this.getUserData();
  }
  
  async getUserData() {
    this.user = await this.dataService.obtenerUserData();
  }
  
  async getMyPosts(){
    this.userId = await this.dataService.obtenerUserData().then(data => data ? data.user.id : 0);
    this.posts = await this.dataService.getCachedPostsUser(this.userId) || [];
    this.postService.getMyPosts(this.userId).subscribe({
        next: async (response) => {
            await this.dataService.putChachedPostUser(this.userId, response.data);
            this.posts = response.data;
        }, error: (error) => {
            console.log('usando datos cacheados debido a un error en la solicitud:', error);
        }
    })

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
