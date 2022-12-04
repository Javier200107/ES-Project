import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../services/search.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/User";

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {

  users: string[] = [];

  srchString: String = '';
  resultStr: String = '';
  searched: boolean = false;
  foundUsers: boolean = false;
  token = "";
  activeUser!: User;

  constructor(private searchService: SearchService, private route : ActivatedRoute) {

    this.route.queryParams
      .subscribe(params => {
          this.token = params['token']
          this.activeUser = params['user']
        }
      );
    console.log('token', this.token)

  }

  ngOnInit(): void {

  }

  searchUsers(userString:String){
    if(userString){
      console.log(userString)

      this.resultStr = userString;
      this.srchString = '';

      this.searchService.searchUser(userString, this.token).subscribe((userList: Object) => {
        console.log(userList)
        // @ts-ignore
        let usrList = userList['accounts']

        this.searched = true
        this.srchString = '';
        for (let postNum = 0; postNum < usrList.length; postNum++){
          this.users.push(usrList[postNum]);
        }
      }, (error: any) => {
        this.users = []
        console.log(error);
      })
    }


  }



}
