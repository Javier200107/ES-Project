import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import {PostCreationService} from "../../services/post-creation.service";
import {ActivatedRoute} from "@angular/router";
import {GetNumPosts} from "../../models/GetNumPosts";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  posts: Post[] = []
  user!: string
  token!: string
  idUser!: string

  constructor(private postCreationService: PostCreationService, private route : ActivatedRoute) {
    this.route.queryParams
    .subscribe(params => {
        this.user = params["user"]
        this.token = params["token"]
        this.idUser = params["idUser"]
      }
      )
    this.getPostsUser()
  }

  ngOnInit(): void {
  }

  getPostsUser () {
    this.posts = []
    const posts: GetNumPosts = {
      limit: 10,
      offset: 0
    }
    this.postCreationService.getPostsSpecificUser(posts, this.token, "hola").subscribe(
      (result) => {
        console.log("Result = "+result.posts)
        for (const post of result.posts) {
          console.log("Result = " + post.account_name)
          this.posts.push(post)
        }
      }
    )
  }
}
