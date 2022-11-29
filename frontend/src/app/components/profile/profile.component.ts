import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Post } from '../../models/Post'
import { SessionService } from '../../services/session.service'
import { ActivatedRoute } from '@angular/router'

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

  constructor (private sessionService: SessionService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params.user
        this.token = params.token
      }
      )

    const newPost: Post = {
      id: 12,
      text: 'This is mock content for testing purposes testing testing 1231 23fdsfdsfdsfdsfdsfdsfdsfdsfdsfdfdsfdsfdsfdsfsdsfd vsdsfdsfds',
      time: '2022-10-02',
      archived: false,
      account_id: 12,
      account_name: 'kermit',
      parent_id: 12
    }
    this.posts.push(newPost)
    this.posts.push(newPost)
    this.posts.push(newPost)
  }

  ngOnInit (): void {
  }
}
