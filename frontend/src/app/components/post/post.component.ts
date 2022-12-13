import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core'
import { Post } from '../../models/Post'
import {PostCreationService} from "../../services/post-creation.service";
import {CommentsService} from "../../services/comments.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NewPostForm} from "../../models/NewPostForm";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postInfo!: Post

  @Output() postArchived: EventEmitter<any> = new EventEmitter();

  user!: string
  token!: string
  numLikes!: number
  hasLike!: boolean


  postComments: Post[] = []
  seeComments: boolean=false
  commentText!: ''
  public postForm!: FormGroup;

  constructor (private router : Router,
               private postCreationService: PostCreationService,
               private commentService: CommentsService,
               private route : ActivatedRoute,
               private formBuilder: FormBuilder) {

    this.route.queryParams
      .subscribe(params => {
        this.user = params["user"]
        this.token = params["token"]
      }
      )
  }
  ngOnInit (): void {
    this.getNumLikes()
    this.hasLikeF()
  }


  addComment(){
    if(!this.commentText){
      alert("Post cannot be empty!")
      return;
    }

    let newComment: NewPostForm = {
      text: this.commentText,
      parent_id: this.postInfo.id
    }
    this.postCreationService.createPost(newComment, this.token).subscribe((newPost: Post) =>{
      // @ts-ignore
      this.postComments.push(newPost['post'])
      this.commentText =  ''
    }, (error: any) => {
      console.log(error);
    })
  }

  /**let newComment:  Post = {
    id : 1,
    text: "comment test  dcfedf  fe wfef ew fewfewfwefewfew fwefewf wef ewfewfewf" +
      "feregrgregregregre  gre e gergergregregregerge    gregerg e eg re greg re geg" +
      "gregregrgregreregreregrgregregregre",
    time: "comment test",
    archived: 1,
    account_id: 1,
    account_name: "admin",
    accounts_like: [],
    num_likes: 0,
    community: 0,
  }**/


  private buildForm () {
    this.postForm = this.formBuilder.group({
      postText: ['']
    })
  }




  getComments(){
    const requestParams = {
      limit:50,
      offset: 0
    }
    // @ts-ignore
    this.commentService.getPostComments(this.postInfo.id,requestParams, this.token).subscribe((newPosts: Object) => {
      // @ts-ignore
      let postList = newPosts['comments']
      for (let postNum = 0; postNum < postList.length; postNum++){
        this.postComments.push(postList[postNum]);
      }
    }, (error: any) => {
      console.log(error);
    })
  }

  goToComment(){
    this.getComments()
    this.seeComments = !this.seeComments
    if(this.seeComments){
      this.postComments = []
    }
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
