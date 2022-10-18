import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email!: string;
  password!: string;

  constructor(private router : Router, private route : ActivatedRoute) { }

  ngOnInit(): void {
  }

  checkLogin() {

    /*const newUser: User = {
      username: //sacarlo de la base de datos,
      email: this.email,
      password: this.password,
    };*/
    
    console.log(this.email, this.password)
    if (true){
      this.router.navigate(['/home']);
    }
  }

}
