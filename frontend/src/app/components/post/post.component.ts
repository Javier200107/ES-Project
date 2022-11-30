import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core'
import { Post } from '../../models/Post'
import {PostCreationService} from "../../services/post-creation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postInfo!: Post

  @Output() postArchived: EventEmitter<any> = new EventEmitter();

  user!: string
  token!: string

  constructor (private postCreationService: PostCreationService, private route : ActivatedRoute) {
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
    this.postCreationService.changeToArchivedPost(id, archived, this.token).subscribe(
      (result) => {
        this.postArchived.emit()
      }
    )
  }
}
