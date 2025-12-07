import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonItemDivider, IonItem, IonTextarea, ModalController ,IonButton , IonModal, IonContent, IonList, IonAvatar, IonLabel, IonHeader, IonToolbar } from "@ionic/angular/standalone";
import { Comment } from 'src/app/models/Post';
import { UserData } from 'src/app/models/User';
import { CommentService } from 'src/app/services/comment-service';
import { DataService } from 'src/app/services/data/data-service';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss'],
  imports: [IonLabel, IonAvatar, IonList, IonContent, IonButton, IonTextarea, IonItem, IonItemDivider, CommonModule, FormsModule]
})
export class CommentsModalComponent implements OnInit {
  @Input() comments: Comment[] = [];
  @Input() postId: number = 0;
  constructor(private modalCtrl: ModalController) {}
  commentService = inject(CommentService)
  dataService = inject(DataService)
  newComment: string = '';
  userData : UserData | null = null;
  
  async ngOnInit(){
      this.userData = await this.dataService.obtenerUserData();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  addComment() {
    this.prePushComment();
    var stageCoomment = this.newComment;
    this.newComment = '';
    this.commentService.addComment(this.postId, stageCoomment).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.rollbackPrePushComment();
      }
    });
  }
  
  prePushComment(){
    var comment : Comment = {
        id: this.userData?.user.id || 0,
        content: this.newComment,
        user: {
            id: this.userData?.user.id || 0,
            name: this.userData?.user.name || '',
            avatar_url: this.userData?.user.avatar_url || ''
        }
    };
    
    this.comments.push(comment)
    this.dataService.updateCachedPostComment(this.postId, comment);
  }
  
  rollbackPrePushComment(){
    this.comments.pop();
    this.dataService.removeLastCachedPostComment(this.postId);
  }

}
