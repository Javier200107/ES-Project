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

  createPost(newPost:NewPostForm)  {
    return this.http.post<NewPostForm>(`${environment.baseApiUrl}/posts`, newPost);
  }
}
