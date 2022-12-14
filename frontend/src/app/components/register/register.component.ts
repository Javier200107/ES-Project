import { Component, OnInit } from '@angular/core'
import { User } from '../../models/User'
import { Router, ActivatedRoute } from '@angular/router'
import { SessionService } from '../../services/session.service'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username!: string
  email!: string
  password!: string
  name!: string
  surname!: string
  birthdate!: string

  firstSlide: boolean = true
  nextButton: string = 'Next'
  sessionUser!: User
  public firstForm!: FormGroup
  public secondForm!: FormGroup

  environment = `${environment.assets}/img/`

  constructor (private router : Router, private route :
    ActivatedRoute, private sessionService: SessionService,
              private formBuilder: FormBuilder) {
  }

  // si hi ha sessió iniciada que vagi a home
  ngOnInit (): void {
    this.buildForm()
  }

  onBackBtn () {
    this.nextButton = 'Next'
    this.firstSlide = true
  }

  firstSubmit () {
    this.nextButton = 'Register'
    this.firstSlide = false
    if (!this.username) {
      alert('Please add a username!')
      return false
    }
    if (!this.email) {
      alert('Please add an email!')
      return false
    }
    if (!this.password) {
      alert('Please add a password!')
      return false
    }
    return true
  }

  secondSubmit () {
    if (!this.name) {
      alert('Please add a username!')
      return
    }
    if (!this.surname) {
      alert('Please add an email!')
      return
    }
    if (!this.birthdate) {
      alert('Please add a password!')
      return
    }
    this.onPost()
  }

  onPost () {
    const newUser: User = {
      username: this.username,
      email: this.email,
      password: this.password,
      nom: this.name,
      cognom: this.surname,
      birthdate: this.birthdate,
      is_admin: false
    };

    this.username = '';
    this.email = '';
    this.password = '';
    this.name = '';
    this.surname = '';
    this.birthdate = '';

    this.sessionService.register(newUser).subscribe(
      (user) =>
      {
          if (user) {
          this.sessionUser=user
          console.log('Session User', this.sessionUser)
        }},
      err => {console.error('Error: status = ', err.status, " and statusText = ", err.statusText),
        alert('Error on Register');},
      () => this.router.navigate(['/login']));
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
          this.patternValidator(/^.{8,}$/, { hasMinLength: true })]]
    })
    this.secondForm = this.formBuilder.group({
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
