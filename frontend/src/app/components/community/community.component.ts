import { Component, OnInit } from '@angular/core'
import { Post } from '../../models/Post'
import { HomeFeedService } from '../../services/home-feed.service'
import { ActivatedRoute } from '@angular/router'
import { NewPostForm } from '../../models/NewPostForm'
import { PostCreationService } from '../../services/post-creation.service'

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  posts2: Post[] = []
  numInitialPosts = 25
  postsPerLoad = 10
  currentPost = 0
  token = ''
  user!: string
  newProfilePhotoURL = null
  postId = null
  justTextPost!: Post

  // TODO Pass a session service with the token
  constructor (private homeFeed: HomeFeedService, private route: ActivatedRoute, private postCreator: PostCreationService) {
    this.route.queryParams
      .subscribe(params => {
        this.token = params.token
        this.user = params.user
      }
      )
    console.log('token', this.token)
  }

  ngOnInit (): void {
    this.demanarPost2()
  }

  demanarPost2 () {
    this.posts2 = []
    const requestParams2 = {
      limit: this.postsPerLoad,
      offset: this.currentPost
    }
    // @ts-ignore
    this.homeFeed.getPostsFromFollowing(requestParams2, this.token, this.user).subscribe((newPosts: Object) => {
      // @ts-ignore
      const postList = newPosts.posts
      for (let postNum = 0; postNum < postList.length; postNum++) {
        this.posts2.push(postList[postNum])
        this.currentPost = this.currentPost + 1
      }
    }, (error: any) => {
      console.log(error)
    })
  }

  addPost (newPost: NewPostForm) {
    const fileToUpload = newPost.post_file
    this.postCreator.createPost(newPost, this.token).subscribe((newPost: Post) => {
      // @ts-ignore
      this.justTextPost = newPost.post
      // @ts-ignore
      this.postId = this.justTextPost.id
    }, (error: any) => {
      console.log(error)
    }, () => {
      if (fileToUpload != null && this.postId != null) {
        const formDades = new FormData()
        formDades.append('image1', fileToUpload)
        this.postCreator.putPostImage(formDades, this.postId, this.token).subscribe(
          (res: Post) => {
            // @ts-ignore
            const post = res.post
            this.newProfilePhotoURL = post.image1
            this.posts2.unshift(post)
          }, error => {
            console.log(error)
          }
        )
      } else {
        this.posts2.unshift(this.justTextPost)
      }
    })
  }
}
