import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import {HomeFeedService} from "../../services/home-feed.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  posts2: Post[] = []
  numInitialPosts = 25;
  postsPerLoad = 10;
  currentPost = 0;
  token = "";
  user!: string

  //TODO Pass a session service with the token
  constructor(private homeFeed: HomeFeedService, private route : ActivatedRoute) {

    this.route.queryParams
      .subscribe(params => {
          this.token = params['token']
          this.user = params['user']
        }
      );
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
      let postList = newPosts['posts']
      for (let postNum = 0; postNum < postList.length; postNum++){
        this.posts2.push(postList[postNum]);
        this.currentPost = this.currentPost +1;
      }
    }, (error: any) => {
      console.log(error);
    })
  }
}
