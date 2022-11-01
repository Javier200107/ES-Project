import { Component, OnInit, Input } from '@angular/core';
import {Post} from "../../models/Post";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  username:string = "username";
  nickname:string = "nickname"
  content:string = " Here comes the content! ffgdgfdgfdgfdnvoidnbonniobnrd\n" +
    "      brbronfsdfdsgdsgrebtreynrtnytrnytrndytrdyntrnd."

  num_comments: number = 0;
  @Input() postInfo!: Post;

  constructor() { }

  ngOnInit(): void {
    console.log(this.postInfo)
  }

}
