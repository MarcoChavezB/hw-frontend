import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, } from "@ionic/angular/standalone";
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";
import { PostService } from 'src/app/services/post/post-service';

@Component({
  selector: 'app-fyp',
  templateUrl: './fyp.component.html',
  styleUrls: ['./fyp.component.scss'],
  imports: [IonInfiniteScrollContent, IonInfiniteScroll,IonList, IonContent, PostCardComponent],
})
export class FypComponent  implements OnInit {
  items: string[] = [];
  postService = inject(PostService);
  
  ngOnInit() {
    console.log('FypComponent initialized');
    this.fetchPosts();
  }
  
  fetchPosts() {
    this.postService.getPosts().subscribe({
        next: (response) => {
            console.log('Posts fetched:', response);
        }, error: (error) => {
            console.error('Error fetching posts:', error);
        }
    })  
  }
  
  onIonInfinite(event: InfiniteScrollCustomEvent) {
  }

}
