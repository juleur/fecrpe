import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import * as Cookies from 'js-cookie';
import { LOGIN_GQL, TokenResponse } from './login-gql';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder, private apollo: Apollo,
    private router: Router, private toast: ToastrService,
    private auth: AuthService
  ) {}
  private querySub: Subscription;
  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.querySub = this.apollo.watchQuery<TokenResponse>({
      query: LOGIN_GQL,
      variables: {
        input: {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        }
      },
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe(res => {
      if (res.data === undefined && res.data === null) {
        for (const err of res.errors) {
          switch (err.extensions.statusText) {
            case 'Not Found':
              this.toast.warning(`${err.message}`, 'Se Connecter', {
                positionClass: 'toast-top-full-width',
                timeOut: 3000
              });
              break;
            case 'Internal Server Error':
              this.toast.error(`${err.message}`, 'Se Connecter', {
                positionClass: 'toast-top-full-width',
                timeOut: 3000
              });
              break;
          }
        }
      } else {
        Cookies.set('access_token', res.data.login.jwt, { secure: false });
        Cookies.set('refresh_token', res.data.login.refreshToken, { secure: false, expires: 14 });
        this.auth.changeAuthStatus(true);
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
