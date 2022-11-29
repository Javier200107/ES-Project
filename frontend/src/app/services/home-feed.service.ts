import { Injectable } from '@angular/core'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { Post } from '../models/Post'

@Injectable({
  providedIn: 'root'
})
export class HomeFeedService {
  constructor (private http:HttpClient) { }

  getPostsFrom (params: any) {
    console.log(this.http.get<Post[]>(`${environment.baseApiUrl}/posts${params}`))
    return this.http.get<Post[]>(`${environment.baseApiUrl}/posts${params}`)
  }
}
