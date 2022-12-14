import { Component, OnInit } from '@angular/core';
import {Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PostCreationService} from "../../services/post-creation.service";
import {SessionService} from "../../services/session.service";
import {InfoUserCreated} from "../../models/InfoUserCreated";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent implements OnInit {

  @Input() username!:string;

  following: Boolean = false;
  followText: String = 'Follow'
  isYou: boolean = false
  userAccountInfo!: InfoUserCreated
  environment = `${environment.baseApiUrl}/`

  user!: string
  token!: string

  constructor(private router : Router, private postCreationService: PostCreationService, private sessionService: SessionService, private route : ActivatedRoute) {
  this.route.queryParams
    .subscribe(params => {
      this.user = params["user"]
      this.token = params["token"]
    }
    )
  }
  ngOnInit(): void {
    this.getInfoUser()
  }

  goToProfile(){

    if (this.user != this.username){
      this.router.navigate(['/profileUser'], { queryParams: { user: this.user, token: this.token, idUser: this.username } })
    } else {
      this.router.navigate(['/profile'], { queryParams: { user: this.user, token: this.token } })
    }
  }

  followUser(){
    if(this.following){
      this.followText = 'Follow';
      this.following = false;
    }else{
      this.following = true;
      this.followText = 'Unfollow';
    }
  }

  getInfoUser() {
    this.sessionService.getInfoAccount(this.username, this.token).subscribe(
      (result) => {
        this.userAccountInfo = result.account
      }
    )
  }

}
