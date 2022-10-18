import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {User} from "../models/User";
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http:HttpClient) { }

  //Crear un element de resposta?? amb html response i objecte? de moment només user
  register(user:User): Observable<User> {
    console.log('Post User', user)
    return this.http.post<User>(`${environment.baseApiUrl}/account`, user)
  }

}
