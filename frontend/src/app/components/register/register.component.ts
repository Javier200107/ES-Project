import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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
}

