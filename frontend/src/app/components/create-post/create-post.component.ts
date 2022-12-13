import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NewPostForm } from "../../models/NewPostForm";
import {Post} from "../../models/Post";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  @Input() token!: string;
  @Output() newPostEvent = new EventEmitter<NewPostForm>();

  public postForm!: FormGroup;
  post_content!: string;

  newPost!: Post;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm()
  }

  createPost() {

    if(!this.post_content){
      alert("Post cannot be empty!")
      return;
    }
    const postContent: NewPostForm = {
      text: this.post_content,
    }
    this.newPostEvent.emit(postContent)
    this.post_content = ''
  }

  private buildForm () {
    this.postForm = this.formBuilder.group({
      postText: ['',
        [Validators.required,Validators.maxLength(256)]]
    })
  }

  attachPhoto() {

  }
}
