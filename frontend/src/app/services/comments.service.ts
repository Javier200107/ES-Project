import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor (private http:HttpClient) { }

  getPostComments (postId: number, params: any, token: String): Observable<Object> {
    console.log('request comments')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
      params
    }
    // @ts-ignore
    return this.http.get<Object>(`${environment.baseApiUrl}/comments/${postId}`, httpOptions)
  }
}
