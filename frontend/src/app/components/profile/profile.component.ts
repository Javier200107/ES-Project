import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Post } from '../../models/Post'
import { ActivatedRoute } from '@angular/router'
import { PostCreationService } from '../../services/post-creation.service'
import { GetNumPosts } from '../../models/GetNumPosts'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  posts: Post[] = []
  postsArchived: Post[] = []
  user!: string
  token!: string

  constructor (private postCreationService: PostCreationService, private route : ActivatedRoute) {
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
}
