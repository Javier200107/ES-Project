import { Injectable } from '@angular/core';

import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { NewPostForm} from "../models/NewPostForm";

@Injectable({
  providedIn: 'root'
})
export class PostCreationService {

  constructor(private http:HttpClient) { }

  createPost(newPost:NewPostForm)  { //: Observable<Post> {
    console.log('New Post', newPost)
    //return this.http.post<newPost>(`${environment.baseApiUrl}/account`, newPost);
  }
}
