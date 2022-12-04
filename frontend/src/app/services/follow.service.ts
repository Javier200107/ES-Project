import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageBackend} from "../models/MessageBackend";
import {environment} from "../../environments/environment";
import {Follow} from "../models/Follow";

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http:HttpClient) { }

    isFollowUser(idUser: string, token: string){
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
    return this.http.post(`${environment.baseApiUrl}/follow/${idUser}`,{},
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
}
