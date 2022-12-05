import { Injectable } from '@angular/core';
import {NewPostForm} from "../models/NewPostForm";
import {Observable} from "rxjs";
import {Post} from "../models/Post";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http:HttpClient) { }

  searchUser(searchStr:String, token:String): Observable<Object> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.get<Object>(`${environment.baseApiUrl}/accounts/search/${searchStr}`, httpOptions);
  }
}
