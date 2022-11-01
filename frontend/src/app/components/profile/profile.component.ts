import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import {SessionService} from "../../services/session.service";
import {ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  posts: Post[] = []
  user!: string
  token!: string

  constructor(private sessionService: SessionService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']
        this.token = params['token']
      }
    );

    const newPost: Post = {
      user: this.user,
      content: "This is mock content for testing purposes testing testing 1231 23",
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
  }

}
