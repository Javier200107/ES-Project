import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from "../../models/Post";
import {HomeFeedService} from "../../services/home-feed.service";
import {PostCreationService} from "../../services/post-creation.service";
import {NewPostForm} from "../../models/NewPostForm";
import {ActivatedRoute} from "@angular/router";
import {ProfileSimplified} from "../../models/ProfileSimplified";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = []
  numInitialPosts = 25;
  postsPerLoad = 10;
  currentPost = 0;
  token = ""
  newProfilePhotoURL = null
  postId = null
  justTextPost!: Post

  @Output() postCreated: EventEmitter<any> = new EventEmitter();

  //TODO Pass a session service with the token
  constructor(private homeFeed: HomeFeedService,
              private route: ActivatedRoute,
              private postCreator: PostCreationService) {

    this.route.queryParams
      .subscribe(params => {
          this.token = params['token']
        }
      );
  }

  ngOnInit(): void {
    this.demanarPost()
  }

  addPost(newPost: NewPostForm) {
    let fileToUpload = newPost.post_file
    this.postCreator.createPost(newPost, this.token).subscribe((newPost: Post) => {
      // @ts-ignore
      this.justTextPost = newPost['post']
      // @ts-ignore
      this.postId = this.justTextPost['id']
    }, (error: any) => {
      console.log(error)
    }, () => {
      if (fileToUpload != null && this.postId != null) {
        const formDades = new FormData()
        formDades.append('image1', fileToUpload)
        this.postCreator.putPostImage(formDades, this.postId, this.token).subscribe(
          (res: Post) => {
            // @ts-ignore
            let post = res['post']
            this.newProfilePhotoURL = post['image1']
            this.posts.unshift(post)
          }, error => {
            console.log(error)
          }
        )
      } else {
        this.posts.unshift(this.justTextPost)
      }
    })
  }

  demanarPost() {
    const requestParams = {
      limit: this.postsPerLoad,
      offset: this.currentPost
    }
    // @ts-ignore
    this.homeFeed.getPostsFrom(requestParams, this.token).subscribe((newPosts: Object) => {
      // @ts-ignore
      let postList = newPosts['posts']
      for (let postNum = 0; postNum < postList.length; postNum++) {
        this.posts.push(postList[postNum]);
        this.currentPost = this.currentPost + 1;
      }
    }, (error: any) => {
      console.log(error);
    })
  }
}
