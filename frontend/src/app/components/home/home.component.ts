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
      user: "kermit",
      content: "This is mock content for testing purposes testing testing 1231 23fdsfdsfdsfdsfdsfdsfdsfdsfdsfdfdsfdsfdsfdsfsdsfd vsdsfdsfds",
      archived: "2022-10-02",
      likes: 5,
      comments:  2,
      reposts: 0
    };
    this.posts.push(newPost)
    this.posts.push(newPost)
    this.posts.push(newPost)
  }

  ngOnInit(): void {
    //this.demanarPost();

  }


  demanarPost(){
    let requestParams = {
      "limit": this.postsPerLoad,
      "offset": this.currentPost,
    }
    this.homeFeed.getPostsFrom(requestParams).subscribe((posts: Post[]) => {
      for (let postNum = 0; postNum< posts.length; postNum++){
        this.posts.push(posts[postNum]);
      }
    }, (error) => {
      console.log(error);
    })

  }

  createPost() {

  }

}
