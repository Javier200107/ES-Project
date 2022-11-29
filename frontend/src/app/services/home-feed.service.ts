import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Post} from "../models/Post";
import {UserLogin} from "../models/UserLogin";

@Injectable({
  providedIn: 'root'
})
export class HomeFeedService {
  constructor (private http:HttpClient) { }

  constructor(private http:HttpClient) { }

  getPostsFrom(params: any, token: String): Observable<Object>  {
    console.log(token)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params : params
    };

    // @ts-ignore
    return this.http.get<Object>(`${environment.baseApiUrl}/posts`, httpOptions)

  }
}
