import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { SIGNUP_GQL, SignupResponse } from './signup-gql';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo
  ) {}
  registerForm: FormGroup;

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      username: [''],
      password: ['', Validators.required],
      c_password: ['', Validators.required],
    });
  }

  onRegister(): void {
    this.apollo.mutate<SignupResponse>({
      mutation: SIGNUP_GQL,
      variables: {
        input: {
          email: this.registerForm.value.email,
          username: this.registerForm.value.username,
          password: this.registerForm.value.password
        }
      },
      fetchPolicy: 'no-cache'
    }).subscribe(
      res => {
        console.log(res);
      },
      err => {
        if (err.graphQLErrors) {
          err.graphQLErrors.forEach(e => console.log(e.message));
        }
      }
    );
  }
}
