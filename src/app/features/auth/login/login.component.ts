import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import * as Cookies from 'js-cookie';
import { AuthService } from 'src/app/core/services/auth.service';
import { LOGIN_GQL, TokenResponse } from './login-gql';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private apollo: Apollo
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
    }).valueChanges.subscribe(
      res => {
        Cookies.set('access_token', res.data.login.jwt, { secure: false });
        Cookies.set('refresh_token', res.data.login.refreshToken, { secure: false, expires: 14 });
        this.auth.changeLoginStatus(true);
      },
      err => {
        if (err.graphQLErrors) {
          err.graphQLErrors.forEach(e => console.log(e.message));
        }
      }
    );
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
