import { Injectable } from '@angular/core'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'

import { User } from '../models/User'
import { UserLogin } from '../models/UserLogin'
import {InfoUserCreated} from "../models/InfoUserCreated";
import {AccountInfo} from "../models/AccountInfo";
import {ProfileSimplified} from "../models/ProfileSimplified";
import {Form} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class SessionService{

  sessionToken!: string
  error!: string

  constructor (private http:HttpClient) {
  }

  setToken(token:string){
    this.sessionToken = token
  }

  register(user:User): Observable<User> {
    return this.http.post<User>(`${environment.baseApiUrl}/account`, user);
  }

  login (user:UserLogin): Observable<UserLogin> {
    console.log('Post User', user)
    return this.http.post<UserLogin>(`${environment.baseApiUrl}/login`, user)
    /* .pipe(
        catchError(err => {throw 'Error en realitzar el post '; })) */
  }

  getInfoAccount(userAccount: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.get<AccountInfo>(`${environment.baseApiUrl}/account/${userAccount}`, httpOptions)
  }

  changeInfoAccount(userAccount: string, token: string, user: InfoUserCreated){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.put<AccountInfo>(`${environment.baseApiUrl}/account`, user,
      httpOptions)
  }

  putProfileImage(formDades: FormData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.sessionToken}`
      }),
    };
    return this.http.put<ProfileSimplified>(`${environment.baseApiUrl}/account/files`, formDades, httpOptions)
  }
}
