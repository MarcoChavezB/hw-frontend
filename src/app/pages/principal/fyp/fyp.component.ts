import { Component, OnInit } from '@angular/core';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, } from "@ionic/angular/standalone";
import { PostCardComponent } from "src/app/components/cards/post-card/post-card.component";

@Component({
  selector: 'app-fyp',
  templateUrl: './fyp.component.html',
  styleUrls: ['./fyp.component.scss'],
  imports: [IonInfiniteScrollContent, IonInfiniteScroll,IonList, IonContent, PostCardComponent],
})
export class FypComponent  implements OnInit {
  items: string[] = [];

  ngOnInit() {
  }


  onIonInfinite(event: InfiniteScrollCustomEvent) {
  }

}
