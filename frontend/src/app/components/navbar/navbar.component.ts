import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isChecked = false;
  theme = "brightness_2"

  constructor() { }

  ngOnInit(): void {
  }

  changeTheme(){
    if (this.isChecked){
      this.theme = "brightness_2"
      document.documentElement.setAttribute('tema', 'dark')
    } else {
      this.theme = "wb_sunny"
      document.documentElement.setAttribute('tema', 'light')
    }
  }
}
