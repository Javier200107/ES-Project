import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {

  users: string[] = []
  constructor() { }
  srchString: String = ''
  resultStr: String = ''
  searched: boolean = false
  foundUsers: boolean = false

  token = "";

  ngOnInit(): void {

  }

  searchUsers(userString:String){
    if(userString){
      console.log(userString)
      this.searched = true
      this.resultStr = userString;
      this.srchString = '';
    }
  }



}
