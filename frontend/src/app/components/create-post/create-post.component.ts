import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NewPostForm} from "../../models/NewPostForm";
import {Post} from "../../models/Post";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpHeaders} from "@angular/common/http";
import {ProfileSimplified} from "../../models/ProfileSimplified";
import {SessionService} from "../../services/session.service";
import {environment} from "../../../environments/environment";

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
  previsualization = ''
  selectedFile!: File | null
  avatar!: string
  environment = `${environment.baseApiUrl}/`

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private sessionService: SessionService) {

  }

  ngOnInit(): void {
    this.buildForm()
  }

  createPost(selectedFile: File | null) {
    if (!this.post_content) {
      alert("Post cannot be empty!")
      return;
    }
    const postContent: NewPostForm = {
      text: this.post_content,
      post_file: selectedFile
    }
    this.newPostEvent.emit(postContent)
  }

  private buildForm() {
    this.postForm = this.formBuilder.group({
      postText: ['',
      ]
    })
  }

  attachPhoto($event: Event) {
    // @ts-ignore
    this.selectedFile = <File>event.target.files[0];
    let copy = this.selectedFile
    // @ts-ignore
    this.extreureBase64(copy).then((imatge: any) => {
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

  clearData() {
    this.previsualization = ''
    this.post_content = ''
    this.selectedFile = null
  }
}
