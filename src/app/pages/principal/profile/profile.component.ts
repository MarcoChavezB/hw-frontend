import { Component, inject, OnInit } from '@angular/core';
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";
import { IonContent, IonAvatar, IonButton, IonItem, IonList, IonSegmentButton, IonSegment } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Post, User } from 'src/app/models/Post';
import { PostService } from 'src/app/services/post/post-service';
import { DataService } from 'src/app/services/data/data-service';
import { UserData } from 'src/app/models/User';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonList, IonItem, IonButton, IonAvatar, IonContent, IonContent, IonItem, IonList, PostCardComponent, IonAvatar, CommonModule, FormsModule]
})
export class ProfileComponent {

    posts : Post[] = [];
    favPosts : Post[] = [];
    likedPosts : Post[] = [];
    postService = inject(PostService);
    dataService = inject(DataService);
    userId: number = 0;
    user : UserData | null = null; 
  constructor() { }

  async ionViewWillEnter() {
    this.userId = await this.dataService.obtenerUserData().then(data => data ? data.user.id : 0);
    await this.getUserData();
    await this.getMyPosts();
    await this.getLikedPosts();
    await this.getSavedPosts();
  }
  
  async getUserData() {
    this.user = await this.dataService.obtenerUserData();
  }
  
    async getMyPosts() {
      try {
        const response = await this.postService.getMyPosts(this.userId).toPromise();
        if (!response!.success || response!.data.length === 0) {
          this.posts = [];
          await this.dataService.clearCachedPostsUser(this.userId);
        } else {
          this.posts = response!.data;
          await this.dataService.putChachedPostUser(this.userId, response!.data);
        }
      } catch (error) {
        this.posts = await this.dataService.getCachedPostsUser(this.userId) || [];
      }
    }
    
    async getLikedPosts() {
      try {
        const response = await this.postService.getLikedPosts(this.userId).toPromise();
        if (!response!.success || response!.data.length === 0) {
          this.likedPosts = [];
          await this.dataService.clearCachedLikedPosts(this.userId);
        } else {
          this.likedPosts = response!.data;
          await this.dataService.putCachedLikedPosts(this.userId, response!.data);
        }
      } catch (error) {
        this.likedPosts = await this.dataService.getCachedLikedPosts(this.userId) || [];
      }
    }
    
    async getSavedPosts() {
        try {
          const response = await this.postService.getSavedPosts(this.userId).toPromise();
          if (!response!.success || response!.data.length === 0) {
            this.favPosts = [];
            await this.dataService.clearCachedSavedPosts(this.userId);
          } else {
            this.favPosts = response!.data;
            await this.dataService.putCachedSavedPosts(this.userId, response!.data);
          }
        } catch (error) {
          this.favPosts = await this.dataService.getCachedSavedPosts(this.userId) || [];
        }
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
  
selectedTab: string = 'posts';

getFilteredPosts() {
  if (this.selectedTab === 'posts') {
    return this.posts; 
  } else if (this.selectedTab === 'favorites') {
    return this.favPosts;
  } else if (this.selectedTab === 'likes') {
    return this.likedPosts;
  }
  return [];
}

}
