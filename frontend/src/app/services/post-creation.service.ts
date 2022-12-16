import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { NewPostForm } from '../models/NewPostForm'
import { NewPostText } from '../models/NewPostText'
import { GetNumPosts } from '../models/GetNumPosts'
import { Post } from '../models/Post'
import { GetPost } from '../models/GetPost'
import { Observable } from 'rxjs'
import { ArchivedPost } from '../models/ArchivedPost'
import { MessageBackend } from '../models/MessageBackend'
import { Follow } from '../models/Follow'
import { InfoUserCreated } from '../models/InfoUserCreated'
import { User } from '../models/User'
import { ProfileSimplified } from '../models/ProfileSimplified'

@Injectable({
  providedIn: 'root'
})
export class PostCreationService {
  newPostText!: NewPostText

  constructor (private http: HttpClient) {
  }

  createPost (newPost: NewPostForm, token: String): Observable<Post> {
    this.newPostText = newPost
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.post<Post>(`${environment.baseApiUrl}/posts`, this.newPostText, httpOptions)
  }

  createCommunityPost (newPost:NewPostForm, token:String): Observable<Post> {
    this.newPostText = newPost
    this.newPostText.text = newPost.text
    this.newPostText.parent_id = newPost.parent_id
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.post<Post>(`${environment.baseApiUrl}/posts/1`, this.newPostText, httpOptions)
  }

  putPostImage (formDades: FormData, postId: number, token:String) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.put<Post>(`${environment.baseApiUrl}/posts/${postId}/files`, formDades, httpOptions)
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

  changeToArchivedPost (id: number, archived: number, token: String): Observable<any> {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.put(`${environment.baseApiUrl}/posts/${id}`,
      { archived: !archived },
      headerOptions
    )
  }

  getLike (id: number, token: String): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}/likes/${id}`, {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  addLike (id: number, token: String): Observable<any> {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.post(`${environment.baseApiUrl}/likes/${id}`, {}, headerOptions)
  }

  quitLike (id: number, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.delete(`${environment.baseApiUrl}/likes/${id}`,
      headerOptions
    )
  }

  getPostsSpecificUser (getPostsForm: GetNumPosts, token: String, idUser: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.get<GetPost>(`${environment.baseApiUrl}/uposts/${idUser}`,
      headerOptions
    )
  }

  isFollowUser (idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.get<MessageBackend>(`${environment.baseApiUrl}/follow/${idUser}`,
      headerOptions
    )
  }

  followList (idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.get<Follow>(`${environment.baseApiUrl}/followList/${idUser}`,
      headerOptions
    )
  }

  follow (idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.post(`${environment.baseApiUrl}/follow/${idUser}`, {},
      headerOptions
    )
  }

  unfollow (idUser: string, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.delete(`${environment.baseApiUrl}/follow/${idUser}`,
      headerOptions
    )
  }

  getLikesPost (idPost: number, token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.get(`${environment.baseApiUrl}/likePlist/${idPost}`,
      headerOptions
    )
  }

  getLikedPosts (token: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.get<GetPost>(`${environment.baseApiUrl}/likeUlist`,
      headerOptions
    )
  }

  getPost (token:string, id_post: number) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.get<InfoUserCreated>(`${environment.baseApiUrl}/post/${id_post}`,
      headerOptions
    )
  }

  deletePost (token: string, id_post: number) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.delete(`${environment.baseApiUrl}/posts/${id_post}`,
      headerOptions
    )
  }

  deleteAccount (token: string, user: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    }
    return this.http.delete(`${environment.baseApiUrl}/account/${user}`,
      headerOptions
    )
  }
}
