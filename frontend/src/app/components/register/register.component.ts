import { Component, OnInit } from '@angular/core';
import {User} from "../models/User";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username!: string;
  email!: string;
  password!: string;

  constructor(private router : Router, private route :
    ActivatedRoute) { }

  ngOnInit(): void {
  }

  onPost() {

    const newUser: User = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    if(!this.registerFromControl(newUser)){
      return;
    }

    console.log(newUser)
    this.username = '';
    this.email = '';
    this.password = '';

    if (true){
      this.router.navigate(['/home']);
    }
  }



  registerFromControl(user: User):Boolean{
    if (!user.username) {
      alert('Please add a username!');
      return false;
    }
    if (!user.email) {
      alert('Please add an email!');
      return false;
    }
    if (!user.password) {
      alert('Please add a password!');
      return false;
    }
    return true;
  }


}

