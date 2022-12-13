import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NewPostForm} from "../../models/NewPostForm";
import {Post} from "../../models/Post";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpHeaders} from "@angular/common/http";
import {PostSimplified} from "../../models/PostSimplified";
import {SessionService} from "../../services/session.service";

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
  uploaded = false
  previsualization = ''
  selectedFile!: File

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private sessionService: SessionService) {

  }

  ngOnInit(): void {
    this.buildForm()
  }

  createPost() {

    if (!this.post_content) {
      alert("Post cannot be empty!")
      return;
    }
    const postContent: NewPostForm = {
      text: this.post_content,
    }
    this.newPostEvent.emit(postContent)
    this.post_content = ''
  }

  private buildForm() {
    this.postForm = this.formBuilder.group({
      postText: ['',
        [Validators.maxLength(256)]]
    })
  }

  attachPhoto($event: Event) {
    this.uploaded = false
    // @ts-ignore
    this.selectedFile = <File>event.target.files[0];
    let precopy = this.selectedFile
    this.extreureBase64(precopy).then((imatge: any) => {
      this.previsualization = imatge.base
    })
  }

  // @ts-ignore
  extreureBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };
    } catch (e) {
      return null;
    }
  })
}
