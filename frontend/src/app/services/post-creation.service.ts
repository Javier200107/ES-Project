import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { NewPostForm} from "../models/NewPostForm";
import {GetNumPosts} from "../models/GetNumPosts";
import {Post} from "../models/Post";
import {GetPost} from "../models/GetPost";

@Injectable({
  providedIn: 'root'
})
export class PostCreationService {
  constructor (private http:HttpClient) { }

  createPost (newPost:NewPostForm) {
    return this.http.post<NewPostForm>(`${environment.baseApiUrl}/posts`, newPost)
  }

  getPostsUser(getPostsForm: GetNumPosts, token: String) {

     const headerOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       }),
       params: {
          "limit": 10,
          "offset": 0,
          "archived": 0,
       }
     };

    return this.http.get<GetPost>(`${environment.baseApiUrl}/posts`,
      headerOptions
    )
  }

  getPostsUserArchived(getPostsForm: GetNumPosts, token: String) {
    const headerOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       }),
       params: {
          "limit": 10,
          "offset": 0,
          "archived": 1,
       }
    };
    return this.http.get<GetPost>(`${environment.baseApiUrl}/posts`,
      headerOptions
    )
  }
}
