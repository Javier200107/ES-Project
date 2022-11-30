import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UserLogin } from '../../models/UserLogin'
import { SessionService } from '../../services/session.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  username!: string
  password!: string
  token!: string

  sessionUser!: UserLogin

  constructor (private router : Router, private route : ActivatedRoute,
              private sessionService: SessionService) {
  }

  ngOnInit (): void {
  }

  checkLogin () {
    const user: UserLogin = {
      username: this.username,
      password: this.password,
      token: null,
      email: '',
      nom: '',
      cognom: '',
      birthdate: ''
    }

    this.sessionService.login(user).subscribe(
      (result) => {
        this.sessionUser = user
        if (result.token) {
          this.token = result.token
          user.token = result.token
          this.sessionService.setToken(result.token)
        }
      },
      err => {
        console.error('Error: status = ', err.status, ' and statusText = ', err.statusText),
        alert('Username or password are wrong, please try again!')
      },
      () => this.router.navigate(['/home'], { queryParams: { user: this.sessionUser.username, token: this.sessionUser.token } }))
  }
}
