import { Component, EventEmitter, OnInit } from '@angular/core'
import { Post } from '../../models/Post'
import { PostCreationService } from '../../services/post-creation.service'
import { ActivatedRoute } from '@angular/router'
import { GetNumPosts } from '../../models/GetNumPosts'
import { FollowService } from '../../services/follow.service'
import { InfoUserCreated } from '../../models/InfoUserCreated'
import { environment } from '../../../environments/environment'
import { SessionService } from '../../services/session.service'

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  postsUser: Post[] = []
  listFollowersOrFollowing: InfoUserCreated[] = []
  listFollowers: InfoUserCreated[] = []
  listFollowing: InfoUserCreated[] = []
  sessionUser!: string
  token!: string
  visitedUsername!: string
  nameButton!: string
  numSeguidores!: number
  numSeguidos!: number
  showFiller = false
  environment = `${environment.baseApiUrl}/`

  isFollowersVisible = false
  isFollowingVisible = false

  ep = false
  visitedUserAccountInfo!: InfoUserCreated

  constructor (
    private followService: FollowService,
    private postCreationService: PostCreationService,
    private sessionService: SessionService,
    private route : ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe(params => {
      this.sessionUser = params.get('user')!
      this.token = params.get('token')!
      this.visitedUsername = params.get('idUser')!
    })
  }

  // TODO se podria optimizar llamando una sola vez para conseguir toda
  // TODO la info de la cuenta visitada de golpe (getVisitedProfile)
  ngOnInit (): void {
    this.nameButton = 'Follow'
    this.getVisitedProfile()
    this.getPostsUser()
    this.isFollow()
    this.getListFollowers()
    this.getListFollowing()
  }

  isFollow () {
    this.followService.isFollowUser(this.visitedUsername, this.token).subscribe(
      (result) => {
        if (result.message != `Account [${this.visitedUsername}] doesn't follow any account`) {
          this.nameButton = 'UnFollow'
        }
      }
    )
  }

  getListFollowers () {
    this.followService.followList(this.visitedUsername, this.token).subscribe(
      (result) => {
        this.listFollowers = []
        this.numSeguidores = result.ListFollows.length
        this.listFollowers = result.ListFollows
        if (this.isFollowersVisible) {
          this.listFollowersOrFollowing = this.listFollowers
        }
        if (this.isFollowersVisible) {
          this.listFollowersOrFollowing = this.listFollowers
        }
      }
    )
  }

  ng () {
    this.ep = true
    this.getListFollowing()
  }

  getListFollowing () {
    this.followService.followingList(this.visitedUsername, this.token).subscribe(
      (result) => {
        this.numSeguidos = result.ListFollowing.length
        this.listFollowing = result.ListFollowing
      }
    )
  }

  unFollowOrFollow () {
    if (this.nameButton == 'Follow') {
      this.followService.follow(this.visitedUsername, this.token).subscribe(
        (result) => {
          this.nameButton = 'unFollow'
          this.getListFollowers()
        }
      )
    } else {
      this.followService.unfollow(this.visitedUsername, this.token).subscribe(
        (result) => {
          this.nameButton = 'Follow'
          this.getListFollowers()
        }
      )
    }
    if (this.isFollowersVisible) {
      this.getListFollowers()
      this.listFollowersOrFollowing = this.listFollowers
    }
  }

  getPostsUser () {
    const posts: GetNumPosts = {
      limit: 10,
      offset: 0
    }
    this.postCreationService.getPostsSpecificUser(posts, this.token, this.visitedUsername).subscribe(
      (result) => {
        for (const post of result.posts) {
          this.postsUser.push(post)
        }
      }
    )
  }

  onFollowersTextClicked () {
    if (this.isFollowingVisible) {
      this.isFollowingVisible = false
      this.isFollowersVisible = true
      this.listFollowersOrFollowing = this.listFollowers
    } else {
      this.isFollowersVisible = !this.isFollowersVisible
      if (this.isFollowersVisible) {
        this.listFollowersOrFollowing = this.listFollowers
      }
    }
  }

  onFollowingTextClicked () {
    if (this.isFollowersVisible) {
      this.isFollowersVisible = false
      this.isFollowingVisible = true
      this.listFollowersOrFollowing = this.listFollowing
    } else {
      this.isFollowingVisible = !this.isFollowingVisible
      if (this.isFollowingVisible) {
        this.listFollowersOrFollowing = this.listFollowing
      }
    }
  }

  visibilityComponentUser () {
    return !(!this.isFollowingVisible && !this.isFollowersVisible)
  }

  getVisitedProfile () {
    this.sessionService.getInfoAccount(this.visitedUsername, this.token).subscribe(
      (result) => {
        this.visitedUserAccountInfo = result.account
        console.log(this.visitedUserAccountInfo)
      }
    )
  }
}
