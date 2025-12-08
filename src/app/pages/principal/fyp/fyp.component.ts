import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, RefresherCustomEvent, IonList, IonItem, ToastController, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonProgressBar, IonRefresherContent, IonRefresher } from "@ionic/angular/standalone";
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";
import { Post } from 'src/app/models/Post';
import { DataService } from 'src/app/services/data/data-service';
import { PostService } from 'src/app/services/post/post-service';

@Component({
    selector: 'app-fyp',
    templateUrl: './fyp.component.html',
    styleUrls: ['./fyp.component.scss'],
    imports: [IonRefresher, IonRefresherContent, IonList, IonContent, PostCardComponent, CommonModule, IonItem],
})
export class FypComponent implements OnInit {
    posts: Post[] = [];
    postService = inject(PostService);
    dataService = inject(DataService);
    router = inject(Router);

    ngOnInit() {
        this.fetchPosts();
    }

    constructor(
        private toastCtrl: ToastController
    ) { }

    async fetchPosts() {
        this.posts = await this.dataService.obtenerPostData() || [];
        try {
            const response = await this.postService.getPosts().toPromise();

            if (response && response.success && response.data.length > 0) {
                this.posts = response.data;
                await this.dataService.guardarPostData(response.data);
                this.toastMessage('Posts actualizados.');
            } else {
                this.posts = [];
                await this.dataService.clearPostData();
                this.toastMessage('No hay nuevos posts disponibles.');
            }
        } catch (error) {
            this.toastMessage('Estas viendo posts sin conexión.');
            this.posts = await this.dataService.obtenerPostData() || [];
        }
    }

    toastMessage(message: string) {
        this.toastCtrl.create({
            position: 'top',
            message: message,
            duration: 3000,
        }).then(toast => toast.present());
    }

    onIonInfinite(event: InfiniteScrollCustomEvent) {
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

    selectedProfile(userId: number) {
        {
            this.router.navigate([`/home/profile/${userId}`], {
                replaceUrl: false,
                state: { animation: { direction: 'forward' } }
            });
        }
    }

    handleRefresh(event: RefresherCustomEvent) {
        this.fetchPosts().then(() => {
            event.target.complete();
        });
    }
}
