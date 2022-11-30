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

  headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
    }
  )

  constructor (private http:HttpClient) {
  }

  createPost (newPost:NewPostForm) {
    return this.http.post<NewPostForm>(`${environment.baseApiUrl}/posts`, newPost)
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

  getPostsSpecificUser(getPostsForm: GetNumPosts, token: String, idUser: string) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
    }
    console.log("La URL es "+ `${environment.baseApiUrl}/uposts/${idUser}`)
    console.log("El token es "+token)
    return this.http.get<GetPost>(`${environment.baseApiUrl}/uposts/${idUser}`,
      headerOptions
    )
  }
}
