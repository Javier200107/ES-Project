import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PostCreationService } from '../../services/post-creation.service'
import { InfoUserCreated } from '../../models/InfoUserCreated'
import { FollowService } from '../../services/follow.service'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @Input() userInfo!: InfoUserCreated
  @Input() userAccount!: string
  @Input() isFollowers!: boolean

  @Output() onButtonFollowClicked: EventEmitter<any> = new EventEmitter()

  user!: string
  token!: string
  list: any
  disabled = ''
  textButton = 'Follow'
  buttonActived = ''
  userAccountInfo!: InfoUserCreated
  environment = `${environment.baseApiUrl}/`

  constructor (private followService: FollowService, private router : Router, private postCreationService: PostCreationService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params.user
        this.token = params.token
      }
      )
  }

  ngOnInit (): void {
    this.getAvatar()
  }

  goToProfileUser (account_name: string) {
    if (this.user != account_name) {
      this.router.navigate(['/profileUser'], { queryParams: { user: this.user, token: this.token, idUser: account_name } })
    } else {
      this.router.navigate(['/profile'], { queryParams: { user: this.user, token: this.token } })
    }
  }

  accountFollowsUser () {
    const bool = true
    this.list = this.userInfo.followers
    if (this.userAccount == this.user && this.isFollowers) {
      if (this.list) {
        for (const user of this.list) {
          if (user == this.user) {
            this.disabled = 'disabled'
            this.textButton = ''
            this.buttonActived = 'bi bi-check2-circle'
          }
        }
      }
      return bool
    }
    return false
  }

  follow () {
    this.followService.follow(this.userInfo.username, this.token).subscribe(
      (result) => {
        this.list.push(`${this.userInfo.username}`)
        this.disabled = 'disabled'
        this.textButton = ''
        this.buttonActived = 'bi bi-check2-circle'
        this.onButtonFollowClicked.emit()
      }
    )
  }

  getAvatar () {
    this.followService.getInfoUser(this.userInfo.username, this.token).subscribe(
      (result) => {
        this.userAccountInfo = result.account
      },
      err => {
        console.error('Error: status = ', err.status, ' and statusText = ', err.statusText)
      }
    )
  }
}
