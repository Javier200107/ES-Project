import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isChecked = false;
  theme_sidebar = "bg-dark"
  theme_icon = "bi bi-moon-fill"
  theme_dropdown_menu = "dropdown-menu-dark"
  active_home = ""
  active_notif = ""
  active_saved = ""

  constructor() { }

  ngOnInit(): void {
  }

  changeTheme(){
    if (this.isChecked){
      this.theme_icon = "bi bi-moon-fill"
      this.theme_sidebar = "bg-dark"
      this.theme_dropdown_menu = "dropdown-menu-dark"
      document.documentElement.setAttribute('tema', 'dark')
    } else {
      this.theme_icon = "bi bi-brightness-high-fill"
      this.theme_sidebar = "bg-light"
      this.theme_dropdown_menu = "dropdown-menu-light"
      document.documentElement.setAttribute('tema', 'light')
    }
  }

  areActive(active: string){
    this.active_home = ""
    this.active_notif = ""
    this.active_saved = ""
    if(active == 'home'){
      this.active_home = "active"
    } else if (active == 'notif') {
      this.active_notif = "active"
    } else if (active == 'saved'){
      this.active_saved = "active"
    }
  }
}
