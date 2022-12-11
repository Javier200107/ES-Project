import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Post } from '../../models/Post'
import {ActivatedRoute, Router} from '@angular/router'
import { PostCreationService } from '../../services/post-creation.service'
import { GetNumPosts } from '../../models/GetNumPosts'
import {InfoUserCreated} from "../../models/InfoUserCreated";
import {FollowService} from "../../services/follow.service";
import {SessionService} from "../../services/session.service";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  posts: Post[] = []
  postsArchived: Post[] = []
  likedPosts: Post[] = []
  userAccountInfo!: InfoUserCreated
  userInfoUpdate!: InfoUserCreated

  listFollowersOrFollowing: InfoUserCreated[] = []
  listFollowers:  InfoUserCreated[] = []
  listFollowings:  InfoUserCreated[] = []

  user!: string
  token!: string
  displayMaximizable!: boolean;

  numSeguidores!: number
  numSeguidos!: number
  isFollowersVisible = false
  isFollowingVisible = false
  value2!: string;

  newUsername = ""
  newEmail = ""
  newPassword = ""
  newName = ""
  newSurname = ""
  newBirthday = ""

  constructor (
    private followService: FollowService,
    private postCreationService: PostCreationService,
    private sessionService: SessionService,
    private route : ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router : Router
  ) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']
        this.token = params['token']
      }
      )
  }
  ngOnInit (): void {
    this.getInfoAccount()
    this.getPostsUser()
    this.getPostsUserArchived()
    this.getListFollowers()
    this.getListFollowings()
    this.getLikedPosts()
    this.primengConfig.ripple = true;
  }

  // TODO OPTIMIZAR liked posts emitter updatea todo
  // TODO NO PUC TENIR 2 events emitter com a output
  refreshListPosts () {
    this.getPostsUser()
    this.getPostsUserArchived()
    this.getLikedPosts()
  }

  refreshLikedPosts() {
    this.getLikedPosts()
  }

  getPostsUserArchived () {
    this.postsArchived = []
    const posts: GetNumPosts = {
      limit: 10,
      offset: 0
    }

    this.postCreationService.getPostsUserArchived(posts, this.token).subscribe(
      (result) => {
        for (const post of result.posts) {
          this.postsArchived.push(post)
        }
      }
    )
  }

  getPostsUser () {
    this.posts = []
    const posts: GetNumPosts = {
      limit: 10,
      offset: 0
    }

    this.postCreationService.getPostsUser(posts, this.token).subscribe(
      (result) => {
        for (const post of result.posts) {
          this.posts.push(post)
        }
      }
    )
  }

  getLikedPosts() {
    this.likedPosts = []
    this.postCreationService.getLikedPosts(this.token).subscribe(
      (result) => {
        // @ts-ignore
        let likedPosts = result["ListUserLikes"]
        for (const post of likedPosts) {
          this.likedPosts.push(post)
        }
      }, error => {
        console.error('Error: status = ', error.status, ' and statusText = ', error.statusText)
      }
    )
  }

  getListFollowers() {
    this.followService.followList(this.user, this.token).subscribe(
      (result) => {
          this.listFollowers = []
          this.numSeguidores = result.ListFollows.length
          this.listFollowers = result.ListFollows
          if(this.isFollowersVisible) {
            this.listFollowersOrFollowing = this.listFollowers
          }
          if(this.isFollowersVisible) {
            this.listFollowersOrFollowing = this.listFollowers
          }
      }
    )
  }

  getAllLists() {
    this.getListFollowings()
    this.getListFollowers()
  }

  getListFollowings() {
    this.followService.followingList(this.user, this.token).subscribe(
      (result) => {
          this.numSeguidos = result.ListFollowing.length
          this.listFollowings = result.ListFollowing
      }
    )
  }

   onFollowersTextClicked() {
    this.listFollowersOrFollowing = []
    if (this.isFollowingVisible) {
      this.isFollowingVisible = false
      this.isFollowersVisible = true
      this.listFollowersOrFollowing = this.listFollowers
    } else {
      this.isFollowersVisible = !this.isFollowersVisible;
      if(this.isFollowersVisible){
        this.listFollowersOrFollowing = this.listFollowers
      }
    }
  }

  onFollowingTextClicked() {
    this.listFollowersOrFollowing = []
    if (this.isFollowersVisible) {
      this.isFollowersVisible = false
      this.isFollowingVisible = true
      this.listFollowersOrFollowing = this.listFollowings
    } else {
      this.isFollowingVisible = !this.isFollowingVisible;
      if(this.isFollowingVisible){
        this.listFollowersOrFollowing = this.listFollowings
      }
    }
  }

  visibilityComponentUser() {
    return !(!this.isFollowingVisible && !this.isFollowersVisible);
  }

  showMaximizableDialog() {
      this.displayMaximizable = true;
  }

  getInfoAccount() {
    this.sessionService.getInfoAccount(this.user, this.token).subscribe(
      (result) => {
        this.userAccountInfo = result.account
      }
    )
  }

  changeInfoAccount() {
    this.userInfoUpdate = this.userAccountInfo
    if (this.newUsername != "") {
      this.userInfoUpdate.username = this.newUsername
    }
    if (this.newEmail != "") {
      this.userInfoUpdate.email = this.newEmail
    }
    if (this.newPassword != "") {
      this.userInfoUpdate.password = this.newPassword
    }
    if (this.newName != "") {
      this.userInfoUpdate.nom = this.newName
    }
    if (this.newSurname != "") {
      this.userInfoUpdate.cognom = this.newSurname
    }
    this.userInfoUpdate.birthdate = this.newBirthday
    this.sessionService.changeInfoAccount(this.user, this.token, this.userInfoUpdate).subscribe(
      (result) => {
        console.log(result)
        this.userAccountInfo = result.account
        this.user = this.userAccountInfo.username
        this.displayMaximizable = false
        this.deleteNewInfoAccount()
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Changes saved'});
      },
      err => {
        if (err.status == 409) {
          this.showError()
        }
      });
  }

  deleteNewInfoAccount() {
    this.newUsername = ""
    this.newEmail = ""
    this.newName = ""
    this.newSurname = ""
    this.newPassword = ""
    this.newBirthday = ""
  }

  confirm() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to try these changes? \n\n\n Note: If you change Username you will have to log in again.',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.changeInfoAccount()
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Changes have not been saved' });
            this.displayMaximizable = false
        }
    });
  }

 showError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Username or email already exists!'});
  }

  showCancel() {
    this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Changes have not been saved' });
  }
}
