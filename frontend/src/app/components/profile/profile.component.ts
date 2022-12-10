import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Post } from '../../models/Post'
import { ActivatedRoute } from '@angular/router'
import { PostCreationService } from '../../services/post-creation.service'
import { GetNumPosts } from '../../models/GetNumPosts'
import {InfoUserCreated} from "../../models/InfoUserCreated";
import {FollowService} from "../../services/follow.service";
import {SessionService} from "../../services/session.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  posts: Post[] = []
  postsArchived: Post[] = []
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
    private route : ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']
        this.token = params['token']
      }
      )
  }

  ngOnInit (): void {
    this.getPostsUser()
    this.getPostsUserArchived()
    this.getListFollowers()
    this.getListFollowings()
    this.getInfoAccount()
  }

  refreshListPosts () {
    this.getPostsUser()
    this.getPostsUserArchived()
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
    if (this.newUsername) {
      console.log("Hemos cambiado el Username")
    } else if (this.newEmail) {

    } else if (this.newPassword) {

    } else if (this.newName) {

    } else if (this.newSurname) {

    } else if (this.newBirthday) {

    }
  }

  deleteNewInfoAccount() {
  }
}
