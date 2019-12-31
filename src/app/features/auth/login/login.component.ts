import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private fb: FormBuilder, private auth: AuthService,
    private apollo: Apollo, private router: Router
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
    }).valueChanges.subscribe(
      res => {
        if (res.data === undefined || res.data === null) {
          for (const err of res.errors) {
            console.log(err.message);
          }
        } else {
          Cookies.set('access_token', res.data.login.jwt, { secure: false });
          Cookies.set('refresh_token', res.data.login.refreshToken, { secure: false, expires: 14 });
          this.router.navigate(['/']);
          this.auth.changeLoginStatus(true);
        }
      },
    );
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
