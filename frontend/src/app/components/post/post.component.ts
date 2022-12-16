import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Post } from '../../models/Post'
import { PostCreationService } from '../../services/post-creation.service'
import { CommentsService } from '../../services/comments.service'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from '../../../environments/environment'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NewPostForm } from '../../models/NewPostForm'
import { ConfirmationService, MessageService } from 'primeng/api'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class PostComponent implements OnInit {
  @Input() postInfo!: Post
  @Input() isProfile!: boolean

  @Output() postChanges: EventEmitter<any> = new EventEmitter()

  user!: string
  token!: string
  numLikes!: number
  hasLike!: boolean
  avatar!: string
  environment = `${environment.baseApiUrl}/`
  postComments: Post[] = []
  seeComments: boolean = false
  commentText: string = ''
  postImage = ''
  public postForm!: FormGroup

  constructor (private router: Router,
               private postCreationService: PostCreationService,
               private commentService: CommentsService,
               private route: ActivatedRoute,
               private formBuilder: FormBuilder,
               private messageService: MessageService,
               private confirmationService: ConfirmationService
  ) {
    this.route.queryParamMap.subscribe(params => {
      this.user = params.get('user')!
      this.token = params.get('token')!
    })
  }

  ngOnInit (): void {
    this.getNumLikes()
    this.hasLikeF()
    this.getPostInfo()
  }

  goToComment () {
    this.getComments()
    this.seeComments = !this.seeComments
    if (this.seeComments) {
      this.postComments = []
    }
  }

  getComments () {
    const requestParams = {
      limit: 50,
      offset: 0
    }
    // @ts-ignore
    this.commentService.getPostComments(this.postInfo.id, requestParams, this.token).subscribe((newPosts: Object) => {
      // @ts-ignore
      const postList = newPosts.comments
      for (let postNum = 0; postNum < postList.length; postNum++) {
        this.postComments.push(postList[postNum])
      }
    }, (error: any) => {
      console.log(error)
    })
  }

  addComment () {
    if (!this.commentText) {
      alert('Post cannot be empty!')
      return
    }

    const newComment: NewPostForm = {
      text: this.commentText,
      parent_id: this.postInfo.id
    }
    this.postCreationService.createPost(newComment, this.token).subscribe((newPost: Post) => {
      // @ts-ignore
      this.postComments.push(newPost.post)
      this.postInfo.num_comments = this.postInfo.num_comments + 1
      this.commentText = ''
    }, (error: any) => {
      console.log(error)
    })
  }

  private buildForm () {
    this.postForm = this.formBuilder.group({
      postText: ['']
    })
  }

  getNumLikes () {
    this.postCreationService.getLikesPost(this.postInfo.id, this.token).subscribe(
      (result) => {
        // @ts-ignore
        this.numLikes = result.NumberOfLikes
      }
    )
  }

  hasLikeF () {
    this.postCreationService.getLike(this.postInfo.id, this.token).subscribe(
      (result) => {
        this.hasLike = true
      }, error => {
        this.hasLike = false
      })
  }

  goToProfileUser (account_name: string) {
    if (this.user != account_name) {
      this.router.navigate(['/profileUser'], { queryParams: { user: this.user, token: this.token, idUser: account_name } })
    } else {
      this.router.navigate(['/profile'], { queryParams: { user: this.user, token: this.token } })
    }
  }

  archivedPost (id: number, archived: number) {
    this.postCreationService.changeToArchivedPost(id, archived, this.token).subscribe(
      (result) => {
        this.postChanges.emit(1)
      }
    )
  }

  likeFunction (id: number) {
    this.postCreationService.getLike(id, this.token).subscribe(
      (result) => {
        this.postCreationService.quitLike(id, this.token).subscribe((result) => {
          this.hasLike = false
          this.getNumLikes()
          this.postChanges.emit(2)
        })
      },
      err => {
        console.error('Error: status = ', err.status, ' and statusText = ', err.statusText)
        this.postCreationService.addLike(id, this.token).subscribe((result) => {
          this.hasLike = true
          this.getNumLikes()
          this.postChanges.emit(2)
        })
      }
    )
  }

  getPostInfo () {
    this.postCreationService.getPost(this.token, this.postInfo.id).subscribe((result) => {
      // @ts-ignore
      const resultat = result.post
      this.avatar = resultat.account_avatar
      this.postImage = resultat.image1
    },
    (error: any) => {
      console.log(error)
    })
  }

  deletePost (post_id: number) {
    this.postCreationService.deletePost(this.token, post_id).subscribe(
      (result) => {
        this.postChanges.emit(3)
        // @ts-ignore
        this.messageService.add({ severity: 'success', summary: 'Success', detail: result.message })
      }
    )
  }

  confirmDeletePost () {
    this.confirmationService.confirm({
      message: 'Do you want to delete this post?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deletePost(this.postInfo.id)
        console.log('No llega a entrar')
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' })
      }
    })
  }
}
