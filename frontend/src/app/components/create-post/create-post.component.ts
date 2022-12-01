import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { PostCreationService } from "../../services/post-creation.service";
import { NewPostForm } from "../../models/NewPostForm";
import {Post} from "../../models/Post";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  @Input() token!: string;
  @Output() newPostEvent = new EventEmitter<Post>();

  public postForm!: FormGroup;
  post_content!: string;

  newPost!: Post;

  constructor(private formBuilder: FormBuilder, private postCreator: PostCreationService) { }

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
    this.postCreator.createPost(postContent, this.token).subscribe((newPost: Post) =>{

      // @ts-ignore
      console.log(newPost['post'])
      // @ts-ignore
      this.newPostEvent.emit(newPost['post'])

    }, (error: any) => {
      console.log(error);
    })

    this.post_content = ''
  }

  private buildForm () {
    this.postForm = this.formBuilder.group({
      postText: ['']
    })
  }
}
