import {Component,  Input, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {ActivatedRoute, Router} from "@angular/router";
import {PostCreationService} from "../../services/post-creation.service";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  @Input() originalPost!: Post

  comments: Post[] = []
  postId!: number;
  numInitialPosts = 25;
  postsPerLoad = 10;
  currentPost = 0;
  token = "";

  constructor(private router : Router, private postCreationService: PostCreationService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
          this.postId = params["postId"]
          this.token = params["token"]
        }
      )
    console.log('')
  }
  ngOnInit(): void {
  }

}
