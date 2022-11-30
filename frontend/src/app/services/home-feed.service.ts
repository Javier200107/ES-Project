import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeFeedService {

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

  getPostsFromFollowing(params: any, token: String, user: String): Observable<Object>  {
    console.log(token)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params : params
    };

    // @ts-ignore
    return this.http.get<Object>(`${environment.baseApiUrl}/followingPosts/${user}`, httpOptions)

  }
}
