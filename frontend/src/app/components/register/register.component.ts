import { Component, OnInit } from '@angular/core';
import {User} from "../../models/User";
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService} from "../../services/session.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username!: string;
  email!: string;
  password!: string;

  sessionUser!: User;

  constructor(private router : Router, private route :
    ActivatedRoute, private sessionService: SessionService) { }

  //si hi ha sessió iniciada que vagi a home
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

    this.username = '';
    this.email = '';
    this.password = '';

    if (true){

      this.sessionService.register(newUser).subscribe((user) => this.sessionUser=user);
      console.log('Session User', this.sessionUser)
      this.router.navigate(['/home']);
      return;
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

