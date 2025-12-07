import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingController, NavController, ToastController, IonContent, IonCard, IonButton, IonLabel, IonItem, IonTextarea, IonText, IonInput, IonAvatar, IonTitle, IonChip, IonCardContent, IonIcon, IonList } from "@ionic/angular/standalone";
import { Hashtag } from 'src/app/models/Hashtag';
import { UserData } from 'src/app/models/User';
import { CameraWebService } from 'src/app/services/camera-web-service';
import { DataService } from 'src/app/services/data/data-service';
import { LocationService } from 'src/app/services/location-service';
import { PostService } from 'src/app/services/post/post-service';

@Component({
    selector: 'app-public-post',
    templateUrl: './public-post.component.html',
    styleUrls: ['./public-post.component.scss'],
    imports: [IonList, IonCardContent, IonChip, IonAvatar, IonInput, IonTextarea, IonItem, IonLabel, IonButton, IonCard, IonContent, CommonModule, FormsModule],
})
export class PublicPostComponent implements OnInit {
    photoService = inject(CameraWebService);
    dataService = inject(DataService);
    postService = inject(PostService);
    locationService = inject(LocationService);
    router = inject(Router);
    avatar = "";
    username = "";

    userData: UserData | null = null;

    location: string = "";
    content: string = "";
    title: string = "";
    newTag: string = "";
    hashtags: Hashtag[] = [];
    coords: { lat: number, lon: number } | null = null;
    hashtagsSelected: Hashtag[] = [];
    img = '';
    filteredHashtags: Hashtag[] = [];
    showSuggestions = false;
    navCtrl = inject(NavController)

    constructor(
        private loadingCtrl: LoadingController,
        private toastCtrl : ToastController
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.img = localStorage.getItem('latestPhoto') || '';
            }
        });

    }
    
    async ngOnInit() {
        this.getHashtags();
        this.img = localStorage.getItem('latestPhoto') || '';

        if (this.img === '') {
            this.navCtrl.back();
            return;
        }

        this.userData = await this.dataService.obtenerUserData();
        this.avatar = this.userData?.user.avatar_url || this.avatar;
        this.username = this.userData?.user.name || this.username;
        this.location = await this.locationService.getLocationName();
        this.coords = await this.locationService.getLocation();
    }

    getHashtags() {
        this.postService.getHastags().subscribe(
            (response) => {
                this.hashtags = response.data;
            }
        )
    }


    onTagInputChange() {
        const term = this.newTag.replace('#', '').toLowerCase();

        if (term.length === 0) {
            this.filteredHashtags = [];
            this.showSuggestions = false;
            return;
        }

        this.filteredHashtags = this.hashtags
            .filter(h => h.name.toLowerCase().includes(term))
            .slice(0, 6);

        this.showSuggestions = this.filteredHashtags.length > 0;
    }

    selectSuggestedTag(tag: Hashtag) {
        const tagName = tag.name;

        if (!this.hashtagsSelected.includes(tag)) {
            this.hashtagsSelected.push(tag);
        }

        this.newTag = '';
        this.filteredHashtags = [];
        this.showSuggestions = false;
    }

  async showLoading(message: string = 'Cargando...') {
    const loading = await this.loadingCtrl.create({
      message: message,
    });

    loading.present();
  }
  
    async publishPost() {
        this.showLoading('Publicando...');
        const body = {
            title: this.title,
            description: this.content,
            photo: this.img,
            hashtags: this.hashtagsSelected.map(h => ({ id: h.id })),
            latitude: this.coords?.lat ?? null,
            longitude: this.coords?.lon ?? null
        };
        this.postService.createPost(body).subscribe(
            async (response) => {
                await this.dataService.putNewPost(response.data);
                await this.loadingCtrl.dismiss();
                this.loadingCtrl.dismiss();
                this.toastCtrl.create({
                  message: "Post publicado con éxito.",
                  duration: 3000,
                }).then(toast => toast.present());
                this.router.navigate(['/'], { replaceUrl: true, state: { animation: { direction: 'back' } } });
            },
            async (error) => {
                await this.loadingCtrl.dismiss();
                this.toastCtrl.create({
                  message: "Error al publicar el post. Por favor, intenta de nuevo.",
                  duration: 3000,
                }).then(toast => toast.present());
            }
        );
    }


    takePhoto() {
        this.photoService.startCamera();
        this.router.navigate(['/home/camera-view']);
        this.img = localStorage.getItem('latestPhoto') || '';
    }

    removeTag(tag: Hashtag) {
        this.hashtagsSelected = this.hashtagsSelected.filter(t => t !== tag);
    }
}
