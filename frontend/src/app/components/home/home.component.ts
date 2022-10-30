import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Post[] = []

  constructor() {
    const newPost: Post = {
      user: "kermit",
      content: "This is mock content for testing purposes testing testing 1231 23",
      date: "2022-10-02",
      likes: 5,
      comments:  2,
      reposts: 0
    };
    this.posts.push(newPost)
    this.posts.push(newPost)
    this.posts.push(newPost)
  }

  ngOnInit(): void {

  }

  demanarPost(){

  }

  createPost() {

  }

}
