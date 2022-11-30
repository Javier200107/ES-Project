import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { NewPostForm } from '../models/NewPostForm'
import { GetNumPosts } from '../models/GetNumPosts'
import { Post } from '../models/Post'
import { GetPost } from '../models/GetPost'
import {Observable} from "rxjs";
import {ArchivedPost} from "../models/ArchivedPost";


@Injectable({
  providedIn: 'root'
})
export class PostCreationService {
  constructor (private http:HttpClient) { }

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

  getPostsUser (getPostsForm: GetNumPosts, token: String) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
      params: {
        limit: 10,
        offset: 0,
        archived: 0
      }
    }

    return this.http.get<GetPost>(`${environment.baseApiUrl}/uposts`,
      headerOptions
    )
  }

  getPostsUserArchived (getPostsForm: GetNumPosts, token: String) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
      params: {
        limit: 10,
        offset: 0,
        archived: 1
      }
    }
    return this.http.get<GetPost>(`${environment.baseApiUrl}/uposts`,
      headerOptions
    )
  }



  changeToArchivedPost(id: number, archived: number, token: String): Observable<any> {
    console.log("Entramos en el segundo metodo")
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.put(`${environment.baseApiUrl}/posts/${id}`,
      {archived: !archived},
      headerOptions
    )

  }
}
