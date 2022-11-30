import { Component } from '@angular/core'
import { SessionService } from './services/session.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend'
  user!: string
  token!: string

  constructor (private sessionService: SessionService, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']
        this.token = params['token']
      }
      )
  }

  comprovarURL () {
    const element2 = document.getElementById('content')
    if (this.user) {
      if (element2 != null) {
        element2.classList.add('right')
      }
      return true
    }
    if (element2 != null) {
      element2.classList.remove('right')
    }
    return false
  }
}
