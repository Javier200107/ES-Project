import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UserLogin } from '../../models/UserLogin'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  nameUser = "Geronimo" //TODO Canviar el nombre por el del usuario que hayas creado en la base de datos
  isChecked = false
  theme_sidebar = 'bg-dark'
  theme_icon = 'bi bi-moon-fill'
  theme_dropdown_menu = 'dropdown-menu-dark'
  active_home = 'active'
  active_notif = ''
  active_saved = ''
  active_community = ''
  active_user_search = ''

  user!: string
  token!: string

  constructor (private router : Router, private route : ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.user = params['user']
        this.token = params['token']
      }
      )
  }

  ngOnInit (): void {
  }

  changeTheme () {
    if (this.isChecked) {
      this.theme_icon = 'bi bi-moon-fill'
      this.theme_sidebar = 'bg-dark'
      this.theme_dropdown_menu = 'dropdown-menu-dark'
      document.documentElement.setAttribute('tema', 'dark')
    } else {
      this.theme_icon = 'bi bi-brightness-high-fill'
      this.theme_sidebar = 'bg-light'
      this.theme_dropdown_menu = 'dropdown-menu-light'
      document.documentElement.setAttribute('tema', 'light')
    }
  }


  areActive (active: string) {
    this.active_home = ''
    this.active_notif = ''
    this.active_saved = ''
    this.active_community = ''
    this.active_user_search = ''
    if (active == 'home') {
      this.active_home = 'active',
      this.router.navigate(['/home'], { queryParams: { user: this.user, token: this.token } })
    } else if (active == 'notif') {
      this.active_notif = 'active'
    } else if (active == 'saved') {
      this.active_saved = 'active'
    } else if (active == 'profile') {
      this.router.navigate(['/profile'], { queryParams: { user: this.user, token: this.token } })
    } else if (active == 'community'){
      this.active_community = 'active'
      this.router.navigate(['/community'], { queryParams: { user: this.user, token: this.token } })
    }else if (active == 'userSearch') {
      this.active_user_search = 'active'
      this.router.navigate(['/userSearch'], {queryParams: {user: this.user, token: this.token}})
    }
  }
}
