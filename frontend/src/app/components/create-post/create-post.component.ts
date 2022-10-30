import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  public postForm!: FormGroup;
  post_content!: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm()
  }

  createPost() {
    console.log(this.post_content)
    if(!this.post_content){
      alert("Post cannot be empty!")
      return;
    }
    this.post_content = '';
  }

  private buildForm() {
    this.postForm = this.formBuilder.group({
      postText: ['']
    });
  }
}
