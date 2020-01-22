import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { SIGNUP_GQL, SignupResponse } from './signup-gql';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  constructor(
    private fb: FormBuilder, private apollo: Apollo,
    private toast: ToastrService, private router: Router
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
    }).subscribe(res => {
      if (res.hasOwnProperty('errors')) {
        for (const err of res.errors) {
          switch (err.extensions.statusText) {
            case 'Conflict':
              this.toast.warning(`${err.message}`, 'Création de compte', {
                positionClass: 'toast-top-full-width',
                timeOut: 5000
              });
              break;
            case 'Internal Server Error':
              this.toast.error(`${err.message}`, 'Création de compte', {
                positionClass: 'toast-top-full-width',
                timeOut: 5000
              });
              break;
          }
        }
        this.registerForm.get('email').reset();
        this.registerForm.get('username').reset();
      } else {
        this.toast.success('Inscription effectuée avec succès', 'Création de compte', {
          positionClass: 'toast-top-full-width',
          timeOut: 5000
        });
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 4000);
      }
    });
  }
}
