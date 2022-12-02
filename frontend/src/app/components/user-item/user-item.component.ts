import { Component, OnInit } from '@angular/core';
import {Input} from "@angular/core";

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent implements OnInit {

  @Input() username!:String;

  following: Boolean = false;
  followText: String = 'Follow';

  constructor() { }

  ngOnInit(): void {
  }

  goToProfile(){
    console.log(this.username)
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
}
