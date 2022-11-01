import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import { HomeFeedService } from "../../services/home-feed.service";

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

  constructor(private homeFeed: HomeFeedService) {

    const newPost: Post = {
      id: 12,
      text: "This is mock content for testing purposes testing testing 1231 23fdsfdsfdsfdsfdsfdsfdsfdsfdsfdfdsfdsfdsfdsfsdsfd vsdsfdsfds",
      time: "2022-10-02",
      archived: "2022-10-02",
      account_id: 12,
      account_name: "kermit",
      parent_id: 12
    };
    this.posts.push(newPost)
    this.posts.push(newPost)
    this.posts.push(newPost)
  }

  ngOnInit(): void {
    this.demanarPost();

  }


  demanarPost(){
    let requestParams = {
      "limit": this.postsPerLoad,
      "offset": this.currentPost,
    }
    this.homeFeed.getPostsFrom(requestParams).subscribe((newPosts: Post[]) => {
      for (let postNum = 0; postNum< newPosts.length; postNum++){
        this.posts.push(newPosts[postNum]);
        this.currentPost = this.currentPost +1;
      }
    }, (error) => {
      console.log(error);
    })

  }

  createPost() {

  }

}
