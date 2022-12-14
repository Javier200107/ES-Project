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
  rememberCredentials!: boolean

  constructor (private router : Router, private route : ActivatedRoute,
              private sessionService: SessionService) {
  }

  ngOnInit (): void {
    this.getLocalCredentials()
    this.rememberCredentials = false
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
          if (this.rememberCredentials) {
            localStorage.setItem('username', this.username)
            localStorage.setItem('password', this.password)
          }
        }
      },
      err => {
        console.error('Error: status = ', err.status, ' and statusText = ', err.statusText)
        alert('Username or password are wrong, please try again!')
      },
      () => this.router.navigate(['/home'], { queryParams: { user: this.sessionUser.username, token: this.sessionUser.token } }))
  }

  getLocalCredentials () {
    const user = localStorage.getItem('username')
    const pass = localStorage.getItem('password')
    if (user != null && pass != null) {
      this.username = user
      this.password = pass
      localStorage.clear()
    }
  }

  changeRememberCredentials ($event: Event) {
    this.rememberCredentials = !this.rememberCredentials
  }
}
