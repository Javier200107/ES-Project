import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core'
import { Post } from '../../models/Post'
import {PostCreationService} from "../../services/post-creation.service";
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor (private router : Router, private postCreationService: PostCreationService, private route : ActivatedRoute) {
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

  goToProfileUser(account_name: string){
    if (this.user != account_name){
      this.router.navigate(['/profileUser'], { queryParams: { user: this.user, token: this.token, idUser: account_name } })
    } else {
      this.router.navigate(['/profile'], { queryParams: { user: this.user, token: this.token } })
    }
  }

  archivedPost(id: number, archived: number) {
    this.postCreationService.changeToArchivedPost(id, archived, this.token).subscribe(
      (result) => {
        this.postArchived.emit()
      }
    )
  }
}
