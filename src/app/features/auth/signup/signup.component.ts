import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SignupGQL } from 'src/app/core/graphql/mutations/signup-gql';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private signupGQL: SignupGQL) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      username: [''],
      password: ['', Validators.required],
      c_password: ['', Validators.required],
    });
  }

  onRegister(): void {
    this.signupGQL.mutate({
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    }).pipe(
      catchError(err => of(err))
    );
  }
}
