import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import {SessionService} from "../../services/session.service";
import {ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostCreationService} from "../../services/post-creation.service";
import {GetNumPosts} from "../../models/GetNumPosts";

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

  constructor(private postCreationService: PostCreationService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']
        this.token = params['token']
      }
    );
    this.getPostsUser()
  }

  ngOnInit(): void {
  }

  getPostsUserArchived() {
    const posts: GetNumPosts = {
      "limit": 10,
      "offset": 0
    };

    this.postCreationService.getPostsUser(posts, this.token).subscribe(
      (result) =>
      {
        for (let post of result.posts) {
          this.posts.push(post)
        }
      }
    )
  }

  getPostsUser() {
    const posts: GetNumPosts = {
      "limit": 10,
      "offset": 0
    };

    this.postCreationService.getPostsUser(posts, this.token).subscribe(
      (result) =>
      {
        for (let post of result.posts) {
          this.posts.push(post)
        }
      }
    )
  }
}
