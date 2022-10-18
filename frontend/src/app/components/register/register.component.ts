import { Component, OnInit } from '@angular/core';
import {User} from "../../models/User";
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService} from "../../services/session.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';


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
  public registerForm!: FormGroup;

  constructor(private router : Router, private route :
    ActivatedRoute, private sessionService: SessionService,
              private formBuilder: FormBuilder) { }

  //si hi ha sessió iniciada que vagi a home
  ngOnInit(): void {
    this.buildForm()
  }

  private buildForm(){
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['',
        [Validators.required,
        Validators.minLength(8),
        this.patternValidator(/\d/, { hasNumber: true}),
        this.patternValidator(/[A-Z]/, { hasUpperCase: true}),
        this.patternValidator(/[a-z]/, { hasLowerCase: true}),
        this.patternValidator(/^.{8,}$/, {hasMinLength: true})]]
    });
  }

  patternValidator(regex:RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Si control esta buit no retorna cap error
      }

      // Es comprova si compleix el requisit indicat al primer parametre
      const valid = regex.test(control.value);

      // Si compleix el requisit retorna null, sinó l'error especificat al segon parametre
      return valid ? null : error;
    };
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
