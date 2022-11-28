import { Injectable } from '@angular/core';

import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { NewPostForm} from "../models/NewPostForm";
import {Post} from "../models/Post";

@Injectable({
  providedIn: 'root'
})
export class PostCreationService {

  constructor(private http:HttpClient) { }

  createPost(newPost:NewPostForm, token:String): Observable<Post> {
    console.log(newPost)
    console.log(token)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.post<Post>(`${environment.baseApiUrl}/posts`,newPost, httpOptions);
  }
}
