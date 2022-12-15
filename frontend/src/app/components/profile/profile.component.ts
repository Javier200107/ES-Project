import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Post } from '../../models/Post'
import { ActivatedRoute, Router } from '@angular/router'
import { PostCreationService } from '../../services/post-creation.service'
import { GetNumPosts } from '../../models/GetNumPosts'
import { InfoUserCreated } from '../../models/InfoUserCreated'
import { FollowService } from '../../services/follow.service'
import { SessionService } from '../../services/session.service'
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api'
import { DomSanitizer } from '@angular/platform-browser'
import { ProfileSimplified } from '../../models/ProfileSimplified'
import { environment } from '../../../environments/environment'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  posts: Post[] = []
  postsArchived: Post[] = []
  likedPosts: Post[] = []
  userAccountInfo!: InfoUserCreated
  userInfoUpdate!: InfoUserCreated

  listFollowersOrFollowing: InfoUserCreated[] = []
  listFollowers: InfoUserCreated[] = []
  listFollowing: InfoUserCreated[] = []
  user!: string
  token!: string
  displayMaximizable!: boolean
  displayBannerDialog!: boolean
  uploaded = false
  uploadedBanner = false

  numSeguidores!: number
  numSeguidos!: number
  isFollowersVisible = false
  isFollowingVisible = false

  newUsername = ''
  newEmail = ''
  newPassword = ''
  newName = ''
  newSurname = ''
  newBirthday = ''
  newProfilePhotoURL = null
  newBannerURL = null
  environment = `${environment.baseApiUrl}/`

  previsualization = ''
  previsualizationBanner = ''
  selectedFile!: File
  selectedFileBanner!: File

  public firstForm!: FormGroup
  public secondForm!: FormGroup

  constructor (
    private followService: FollowService,
    private postCreationService: PostCreationService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.route.queryParamMap.subscribe(params => {
      this.user = params.get('user')!
      this.token = params.get('token')!
    })
  }

  ngOnInit (): void {
    this.getInfoAccount()
    this.getPostsUser()
    this.getPostsUserArchived()
    this.getListFollowers()
    this.getListFollowing()
    this.getLikedPosts()
    this.buildForm()
    this.primengConfig.ripple = true
  }

  // TODO OPTIMIZAR liked posts emitter updatea todo
  // TODO NO PUC TENIR 2 events emitter com a output
  refreshListPosts (event: any) {
    if (event == 1) {
      this.getPostsUser()
      this.getPostsUserArchived()
    }
    if (event == 2) {
      this.getLikedPosts()
    }
    if (event == 3) {
      this.getPostsUser()
    }
  }

  getPostsUserArchived () {
    this.postsArchived = []
    const posts: GetNumPosts = {
      limit: 10,
      offset: 0
    }

    this.postCreationService.getPostsUserArchived(posts, this.token).subscribe(
      (result) => {
        for (const post of result.posts) {
          this.postsArchived.push(post)
        }
      }
    )
  }

  getPostsUser () {
    this.posts = []
    const posts: GetNumPosts = {
      limit: 10,
      offset: 0
    }

    this.postCreationService.getPostsUser(posts, this.token).subscribe(
      (result) => {
        for (const post of result.posts) {
          this.posts.push(post)
        }
      }
    )
  }

  getLikedPosts () {
    this.likedPosts = []
    this.postCreationService.getLikedPosts(this.token).subscribe(
      (result) => {
        // @ts-ignore
        const likedPosts = result.ListUserLikes
        for (const post of likedPosts) {
          this.likedPosts.push(post)
        }
      }, error => {
        console.error('Error: status = ', error.status, ' and statusText = ', error.statusText)
      }
    )
  }

  getListFollowers () {
    this.followService.followList(this.user, this.token).subscribe(
      (result) => {
        this.listFollowers = []
        this.numSeguidores = result.ListFollows.length
        this.listFollowers = result.ListFollows
        if (this.isFollowersVisible) {
          this.listFollowersOrFollowing = this.listFollowers
        }
        if (this.isFollowersVisible) {
          this.listFollowersOrFollowing = this.listFollowers
        }
      }
    )
  }

  getAllLists () {
    this.getListFollowing()
    this.getListFollowers()
  }

  getListFollowing () {
    this.followService.followingList(this.user, this.token).subscribe(
      (result) => {
        this.numSeguidos = result.ListFollowing.length
        this.listFollowing = result.ListFollowing
      }
    )
  }

  onFollowersTextClicked () {
    this.listFollowersOrFollowing = []
    if (this.isFollowingVisible) {
      this.isFollowingVisible = false
      this.isFollowersVisible = true
      this.listFollowersOrFollowing = this.listFollowers
    } else {
      this.isFollowersVisible = !this.isFollowersVisible
      if (this.isFollowersVisible) {
        this.listFollowersOrFollowing = this.listFollowers
      }
    }
  }

  onFollowingTextClicked () {
    this.listFollowersOrFollowing = []
    if (this.isFollowersVisible) {
      this.isFollowersVisible = false
      this.isFollowingVisible = true
      this.listFollowersOrFollowing = this.listFollowing
    } else {
      this.isFollowingVisible = !this.isFollowingVisible
      if (this.isFollowingVisible) {
        this.listFollowersOrFollowing = this.listFollowing
      }
    }
  }

  visibilityComponentUser () {
    return !(!this.isFollowingVisible && !this.isFollowersVisible)
  }

  showMaximizableDialog () {
    this.displayMaximizable = true
  }

  getInfoAccount () {
    this.sessionService.getInfoAccount(this.user, this.token).subscribe(
      (result) => {
        this.userAccountInfo = result.account
      }
    )
  }

  changeInfoAccount () {
    this.userInfoUpdate = this.userAccountInfo
    if (this.newUsername != '') {
      this.userInfoUpdate.username = this.newUsername
      localStorage.removeItem('username')
      localStorage.setItem('username', this.newUsername)
    }
    if (this.newEmail != '') {
      this.userInfoUpdate.email = this.newEmail
    }
    if (this.newPassword != '') {
      this.userInfoUpdate.password = this.newPassword
      localStorage.removeItem('password')
      localStorage.setItem('password', this.newPassword)
    }
    if (this.newName != '') {
      this.userInfoUpdate.nom = this.newName
    }
    if (this.newSurname != '') {
      this.userInfoUpdate.cognom = this.newSurname
    }
    if (this.newBirthday != '') {
      this.userInfoUpdate.birthdate = this.newBirthday
    }
    if (this.newProfilePhotoURL != null) {
      this.userInfoUpdate.avatar = this.newProfilePhotoURL
    }
    this.sessionService.changeInfoAccount(this.user, this.token, this.userInfoUpdate).subscribe(
      (result) => {
        this.userAccountInfo = result.account
        this.displayMaximizable = false
        this.clearUpdatedData()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes saved' })
      },
      err => {
        if (err.status == 409) {
          this.showError()
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save changes!' })
        }
        this.displayMaximizable = false
        this.clearUpdatedData()
      },
      () => {
        if (this.userAccountInfo.username != this.user) {
          this.router.navigate(['/login'])
        }
      })
  }

  changeBanner () {
    this.userInfoUpdate = this.userAccountInfo
    if (this.newBannerURL != null) {
      this.userInfoUpdate.banner = this.newBannerURL
    }
    this.sessionService.changeInfoAccount(this.user, this.token, this.userInfoUpdate).subscribe(
      (result) => {
        this.userAccountInfo = result.account
        this.displayBannerDialog = false
        this.clearBannerURL()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes saved' })
      },
      err => {
        if (err.status == 409) {
          this.showError()
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save changes!' })
        }
        this.displayBannerDialog = false
        this.clearBannerURL()
      })
  }

  clearUpdatedData () {
    this.newUsername = ''
    this.newEmail = ''
    this.newName = ''
    this.newSurname = ''
    this.newPassword = ''
    this.newBirthday = ''
    this.newProfilePhotoURL = null
  }

  clearBannerURL () {
    this.newBannerURL = null
  }

  confirm () {
    this.confirmationService.confirm({
      message: 'Do you want to apply these changes? \n\n\n Note: If you change Username you will have to log in again.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.changeInfoAccount()
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Changes have not been saved' })
        this.displayMaximizable = false
      }
    })
    this.previsualization = ''
  }

  confirmBanner () {
    this.confirmationService.confirm({
      message: 'Do you want to update your banner image?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.changeBanner()
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Changes have not been saved' })
        this.displayBannerDialog = false
      }
    })
    this.previsualizationBanner = ''
  }

  showError () {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username or email already exists!' })
  }

  showCancel () {
    this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Changes have not been saved' })
  }

  getProfileImage ($event: Event) {
    this.uploaded = false
    // @ts-ignore
    this.selectedFile = <File>event.target.files[0]
    const precopy = this.selectedFile
    this.extreureBase64(precopy).then((imatge: any) => {
      this.previsualization = imatge.base
    })
  }

  getBannerImage ($event: Event) {
    this.uploadedBanner = false
    // @ts-ignore
    this.selectedFileBanner = <File>event.target.files[0]
    const precopyBanner = this.selectedFileBanner
    this.extreureBase64(precopyBanner).then((imatge: any) => {
      this.previsualizationBanner = imatge.base
    })
  }

  // TODO file extension should be checked
  uploadFile (): any {
    this.uploaded = false
    try {
      const formDades = new FormData()
      formDades.append('avatar', this.selectedFile)
      this.sessionService.putProfileImage(formDades).subscribe(
        (res: ProfileSimplified) => {
          // @ts-ignore
          this.newProfilePhotoURL = res.account.avatar
          this.uploaded = true
          alert('Successfully uploaded!')
        }
      )
    } catch (e) {
      console.log('error ', e)
    }
  }

  uploadBannerFile (): any {
    this.uploadedBanner = false
    try {
      const formDades = new FormData()
      formDades.append('banner', this.selectedFileBanner)
      this.sessionService.putProfileImage(formDades).subscribe(
        (res: ProfileSimplified) => {
          // @ts-ignore
          this.newBannerURL = res.account.banner
          this.uploadedBanner = true
          alert('Successfully uploaded!')
        }
      )
    } catch (e) {
      console.log('error ', e)
    }
  }

  // @ts-ignore
  extreureBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event)
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg)
      const reader = new FileReader()
      reader.readAsDataURL($event)
      reader.onload = () => {
        resolve({
          base: reader.result
        })
      }
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        })
      }
    } catch (e) {
      return null
    }
  })

  showBannerDialog () {
    this.displayBannerDialog = true
  }

  private buildForm () {
    this.firstForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['',
        [Validators.required,
          Validators.minLength(8),
          this.patternValidator(/\d/, { hasNumber: true }),
          this.patternValidator(/[A-Z]/, { hasUpperCase: true }),
          this.patternValidator(/[a-z]/, { hasLowerCase: true }),
          this.patternValidator(/^.{8,}$/, { hasMinLength: true })]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthdate: ['', Validators.required]
    })
  }

  patternValidator (regex:RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null // Si control esta buit no retorna cap error
      }

      // Es comprova si compleix el requisit indicat al primer parametre
      const valid = regex.test(control.value)

      // Si compleix el requisit retorna null, sinó l'error especificat al segon parametre
      return valid ? null : error
    }
  }
}
