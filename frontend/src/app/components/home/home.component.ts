
import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import { HomeFeedService } from "../../services/home-feed.service";
import { PostCreationService} from "../../services/post-creation.service";
import { NewPostForm} from "../../models/NewPostForm";
import {ActivatedRoute} from "@angular/router";

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
  token = "";

  //TODO Pass a session service with the token
  constructor(private homeFeed: HomeFeedService,
              private route : ActivatedRoute,
              private postCreator: PostCreationService) {

    this.route.queryParams
      .subscribe(params => {
          this.token = params['token']
        }
      );
    console.log('token', this.token)

  }

  ngOnInit (): void {
    this.demanarPost()
  }

  addPost(newPost: NewPostForm){
    this.postCreator.createPost(newPost, this.token).subscribe((newPost: Post) =>{

      // @ts-ignore
      console.log(newPost['post'])
      // @ts-ignore
      this.posts.unshift(newPost['post'])

    }, (error: any) => {
      console.log(error);
    })


  }

  demanarPost () {
    const requestParams = {
      limit: this.postsPerLoad,
      offset: this.currentPost
    }
    // @ts-ignore
    this.homeFeed.getPostsFrom(requestParams, this.token).subscribe((newPosts: Object) => {
      // @ts-ignore
      let postList = newPosts['posts']
      for (let postNum = 0; postNum < postList.length; postNum++){
        this.posts.push(postList[postNum]);
        this.currentPost = this.currentPost +1;
      }
    }, (error: any) => {
      console.log(error);
    })
  }
}
