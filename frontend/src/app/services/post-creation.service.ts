import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { NewPostForm } from '../models/NewPostForm'
import { GetNumPosts } from '../models/GetNumPosts'
import { Post } from '../models/Post'
import { GetPost } from '../models/GetPost'
import {Observable} from "rxjs";
import {ArchivedPost} from "../models/ArchivedPost";
import {MessageBackend} from "../models/MessageBackend";
import {Follow} from "../models/Follow";
import {InfoUserCreated} from "../models/InfoUserCreated";


@Injectable({
  providedIn: 'root'
})
export class PostCreationService {

  constructor(private http: HttpClient) {
  }

  createPost(newPost: NewPostForm, token: String): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.post<Post>(`${environment.baseApiUrl}/posts`, newPost, httpOptions);
  }

  createCommunityPost(newPost:NewPostForm, token:String): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.post<Post>(`${environment.baseApiUrl}/posts/1`,newPost, httpOptions);
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

  getPostsUserArchived(getPostsForm: GetNumPosts, token: String) {
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

  getLike(id: number, token: String): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}/likes/${id}`, {
      observe: 'response', headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  addLike(id: number, token: String): Observable<any> {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    console.log("add")
    return this.http.post(`${environment.baseApiUrl}/likes/${id}`, {}, headerOptions)
  }

  quitLike(id: number, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    console.log("quit")
    return this.http.delete(`${environment.baseApiUrl}/likes/${id}`,
      headerOptions
    )
  }

  getPostsSpecificUser(getPostsForm: GetNumPosts, token: String, idUser: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.get<GetPost>(`${environment.baseApiUrl}/uposts/${idUser}`,
      headerOptions
    )
  }

  isFollowUser(idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.get<MessageBackend>(`${environment.baseApiUrl}/follow/${idUser}`,
      headerOptions
    )
  }

  followList(idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.get<Follow>(`${environment.baseApiUrl}/followList/${idUser}`,
      headerOptions
    )
  }

  follow(idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.post(`${environment.baseApiUrl}/follow/${idUser}`, {},
      headerOptions
    )
  }

  unfollow(idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.delete(`${environment.baseApiUrl}/follow/${idUser}`,
      headerOptions
    )
  }

  getLikesPost(idPost: number, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.get(`${environment.baseApiUrl}/likePlist/${idPost}`,
      headerOptions
    )
  }

  getLikedPosts(token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.get<GetPost>(`${environment.baseApiUrl}/likeUlist`,
      headerOptions
    )
  }

  getAvatar(token:string, username: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    return this.http.get<InfoUserCreated>(`${environment.baseApiUrl}/account/${username}`,
      headerOptions
    )
  }
}
