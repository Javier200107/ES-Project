import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PostCreationService} from "../../services/post-creation.service";
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {InfoUserCreated} from "../../models/InfoUserCreated";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() userInfo!: InfoUserCreated

  user!: string
  token!: string
  list: any

  constructor(private router : Router, private postCreationService: PostCreationService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params["user"]
        this.token = params["token"]
      }
      )
  }

  ngOnInit(): void {
  }

  goToProfileUser(account_name: string){
    if (this.user != account_name){
      this.router.navigate(['/profileUser'], { queryParams: { user: this.user, token: this.token, idUser: account_name } })
    } else {
      this.router.navigate(['/profile'], { queryParams: { user: this.user, token: this.token } })
    }
  }

  // @ts-ignore
  accountFollowsUser() {
    if(this.userInfo.username == this.user) {
      return false
    }

    let bool = true
    this.list = this.userInfo.followers
    console.log(this.list)
    if (this.list) {
      for (let users in this.list) {
        // @ts-ignore
        if (users.id == this.idUserAccount) {
          bool = false
        }
      }
      return bool
    }
  }
}
