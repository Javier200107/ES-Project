import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserLogin} from "../../models/UserLogin";
import {SessionService} from "../../services/session.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username!: string;
  password!: string;
  token!: string;

  sessionUser!: UserLogin

  constructor(private router : Router, private route : ActivatedRoute,
              private sessionService: SessionService) {
    /* Esto simplemente es para que no salga la barra de navegación en login, pero SI en los otros componentes.
      Lo que hago es borrar la clases del app.component.html "left" y "right" del id"sidebar" y id"content.
      De otra manera se seguia guardando su espacio y la card salia centrada a la derecha*/
    //FALTARIA COPIAR ESTO EN REGISTRO
    var element = document.getElementById("sidebar");
    var element2 = document.getElementById("content");
    if(element != null){
      element.classList.remove("left");
      element.remove();
    }
    if(element2 != null){
      element2.classList.remove("right");
    }
  }

  ngOnInit(): void {
  }

  checkLogin() {

    const user: UserLogin = {
      username: this.username,
      password: this.password,
      token: null,
      email: "",
      nom: "",
      cognom:  "",
      birthdate:  ""
    };

    this.sessionService.login(user).subscribe(
      (result) =>
      {
        if (result.token) {
          this.token = result.token
        }},
      err => {console.error('Error: status = ', err.status, " and statusText = ", err.statusText),
                        alert('Username or password are wrong, please try again!');},
      () => this.router.navigate(['/home']))
  }
}
