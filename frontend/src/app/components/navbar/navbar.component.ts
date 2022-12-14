import {Component, EventEmitter, OnInit, Output} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {environment} from "../../../environments/environment";
import {PostCreationService} from "../../services/post-creation.service";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class NavbarComponent implements OnInit {
  isChecked = false
  theme_sidebar = 'bg-dark'
  theme_icon = 'bi bi-moon-fill'
  theme_dropdown_menu = 'dropdown-menu-dark'
  active_home = 'active'
  active_notif = ''
  active_saved = ''
  active_community = ''
  active_user_search = ''

  displayMaximizable!: boolean;
  displayPosition!: boolean;
  position!: string;

  user!: string
  token!: string

  environment = `${environment.baseApiUrl}/`
  environmentAssets = `${environment.assets}/img/`
  constructor(
    private router: Router,
    private postCreationService: PostCreationService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.route.queryParams
      .subscribe(params => {
          this.user = params['user']
          this.token = params['token']
        }
      )
  }

  ngOnInit(): void {
  }

  showMaximizableDialog() {
    this.displayMaximizable = true;
  }

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }


  changeTheme() {
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


  areActive(active: string) {
    this.active_home = ''
    this.active_notif = ''
    this.active_saved = ''
    this.active_community = ''
    this.active_user_search = ''
    if (active == 'home') {
      this.active_home = 'active',
        this.router.navigate(['/home'], {queryParams: {user: this.user, token: this.token}})
    } else if (active == 'notif') {
      this.active_notif = 'active'
    } else if (active == 'saved') {
      this.active_saved = 'active'
    } else if (active == 'profile') {
      this.router.navigate(['/profile'], {queryParams: {user: this.user, token: this.token}})
    } else if (active == 'community') {
      this.active_community = 'active'
      this.router.navigate(['/community'], {queryParams: {user: this.user, token: this.token}})
    } else if (active == 'userSearch') {
      this.active_user_search = 'active'
      this.router.navigate(['/userSearch'], {queryParams: {user: this.user, token: this.token}})
    } else if (active == 'settings') {
      this.router.navigate(['/settings'], {queryParams: {user: this.user, token: this.token}})
    }
  }

  deleteAccount(){
    this.postCreationService.deleteAccount(this.token, this.user).subscribe(
      (result2) => {
         this.router.navigate(['/login'])
      }
    )
  }
  confirmDeleteAccount(){
    this.confirmationService.confirm({
        message: 'Do you want to delete the account?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteAccount()
        },
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }
}
