import { Component, OnInit, Input } from '@angular/core'
import { Post } from '../../models/Post'
import {PostCreationService} from "../../services/post-creation.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {ProfileComponent} from "../profile/profile.component";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postInfo!: Post
  user!: string
  token!: string

  constructor (private profileComponent: ProfileComponent ,private postCreationService: PostCreationService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params["user"]
        this.token = params["token"]
      }
      )
  }


  ngOnInit (): void {
    console.log(this.postInfo)
  }

  archivedPost(id: number, archived: number) {
    console.log("LLegaaamos al metodo de archivar")
    this.postCreationService.changeToArchivedPost(id, archived, this.token).subscribe(
      (result) => {
        console.log("Return = "+result)
          this.profileComponent.getPostsUserArchived()
          this.profileComponent.getPostsUser()
      }
    )
  }
}
