import { Component, inject, OnInit } from '@angular/core';
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";
import { IonContent, IonAvatar, RefresherCustomEvent, IonButton, IonItem, IonList, IonSegmentButton, IonSegment, IonGrid, IonRow, IonCol, IonAlert, IonRefresherContent, IonRefresher } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Post, User } from 'src/app/models/Post';
import { PostService } from 'src/app/services/post/post-service';
import { DataService } from 'src/app/services/data/data-service';
import { UserData } from 'src/app/models/User';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth-service';
import type { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    imports: [IonRefresher, IonRefresherContent, IonAlert, IonCol, IonRow, IonGrid, IonSegment, IonSegmentButton, IonList, IonItem, IonButton, IonAvatar, IonContent, IonContent, IonItem, IonList, PostCardComponent, IonAvatar, CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
    router = inject(Router)
    public alertButtons = [
        {
            text: 'Cerrar',
            role: 'cancel',
            handler: () => {
            },
        },
        {
            text: 'Aceptar',
            role: 'confirm',
            handler: () => {
                this.logout();
            },
        },
    ];

    logout() {
        localStorage.clear();
        this.dataService.clearAllCache();
        this.router.navigate(['login'], { replaceUrl: true, state: { animation: { direction: 'back' } } });
    }

    goToDashboard() {
        window.location.href = 'https://hw-analytics.on-forge.com';
    }

    posts: Post[] = [];
    favPosts: Post[] = [];
    likedPosts: Post[] = [];
    postService = inject(PostService);
    dataService = inject(DataService);
    authService = inject(AuthService)
    userId: number = 0;
    user: UserData | null = null;
    showFollowButton: boolean = false;
    alreadyFollowing: boolean = false;
    userAuthId: number = 0;

    constructor() { }

    ngOnInit(): void {
        const urlSegments = window.location.pathname.split('/');
        this.userId = Number(urlSegments[urlSegments.length - 1]);
    }

    async ionViewWillEnter() {
        if (isNaN(this.userId) || this.userId === 0) {
            this.user = await this.dataService.obtenerUserData();
            this.userId = this.user?.user.id || 0;
        } else {
            this.getUserData();
        }
        this.getMyPosts();
        this.getLikedPosts();
        this.getSavedPosts();
        this.userAuthId = (await this.dataService.obtenerUserData())?.user.id || 0;
        this.showFollowButton = this.userId !== this.userAuthId;
    }

    getUserData() {
        this.authService.getUserProfileData(this.userId).subscribe({
            next: async (response) => {
                this.user = response;
                this.alreadyFollowing = this.user?.user.followers.map(u => u.id).includes(this.userAuthId);
            },
            error: (error) => {
                console.error('Error fetching user data:', error);
            }
        });
    }


    async getMyPosts() {
        this.posts = await this.dataService.getCachedPostsUser(this.userId) || [];
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

    likePost(postId: number, post: Post) {
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

    savePost(postId: number, post: Post) {
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

    toggleFollowUser() {
        this.alreadyFollowing = !this.alreadyFollowing;
        this.authService.toggleFollowUser(this.userId).subscribe({
            next: (response) => {
                this.alreadyFollowing = response.state;
            },
            error: (error) => {
                this.alreadyFollowing = !this.alreadyFollowing;
            }
        });
    }

    handleRefresh(event: RefresherCustomEvent) {
        this.ionViewWillEnter().then(() => {
            event.target.complete();
        });
    }
}
