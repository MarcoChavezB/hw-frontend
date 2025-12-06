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
    console.log('Cargando más datos...');
  }

}
