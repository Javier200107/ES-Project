import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Post } from '../../models/Post'
import {PostCreationService} from "../../services/post-creation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() postInfo!: Post

  @Output() postArchived: EventEmitter<any> = new EventEmitter();

  user!: string
  token!: string
  numLikes!: number
  hasLike!: boolean
  environment = `${environment.baseApiUrl}/`

  public postForm!: FormGroup;

  constructor(private router : Router, private postCreationService: PostCreationService, private route : ActivatedRoute,private formBuilder: FormBuilder) {
    this.route.queryParams
      .subscribe(params => {
          this.user = params["user"]
          this.token = params["token"]
        }
      )
  }

  ngOnInit(): void {
    this.getNumLikes()
    this.hasLikeF()
  }



  getNumLikes(){
    this.postCreationService.getLikesPost(this.postInfo.id, this.token).subscribe(
      (result) => {
        // @ts-ignore
        this.numLikes = result["NumberOfLikes"]
      }
    )
  }

  goToProfileUser(account_name: string){
    if (this.user != account_name){
      this.router.navigate(['/profileUser'], { queryParams: { user: this.user, token: this.token, idUser: account_name } })
    } else {
      this.router.navigate(['/profile'], { queryParams: { user: this.user, token: this.token } })
    }
  }

  archivedPost(id: number, archived: number) {
    this.postCreationService.changeToArchivedPost(id, archived, this.token).subscribe(
      (result) => {
        this.postArchived.emit()
      }
    )
  }

  hasLikeF() {
    this.postCreationService.getLike(this.postInfo.id, this.token).subscribe(
      (result) =>{
        this.hasLike = true;
      }, error => {
        this.hasLike = false;
      })
  }

  likeFunction(id: number) {
    this.postCreationService.getLike(id, this.token).subscribe(
      (result) =>{
        this.postCreationService.quitLike(id, this.token).subscribe((result) => {
          this.hasLike = false
          this.getNumLikes()
          this.postArchived.emit()
        })
      },
      err => {
        console.error('Error: status = ', err.status, ' and statusText = ', err.statusText)
        this.postCreationService.addLike(id, this.token).subscribe((result) => {
          this.hasLike = true
          this.getNumLikes()
          this.postArchived.emit()
        })
      },
    )
  }

}
