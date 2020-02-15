import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import * as Cookies from 'js-cookie';
import { LOGIN_GQL, TokenResponse } from './login-gql';
import { ToastrService } from 'ngx-toastr';
import { AuthStatusService } from 'src/app/core/services/auth-status.service';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder, private apollo: Apollo,
    private router: Router, private toast: ToastrService,
    private authStatus: AuthStatusService
  ) {}
  loading: boolean;
  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.apollo.watchQuery<TokenResponse>({
      query: LOGIN_GQL,
      variables: {
        input: {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        }
      },
      fetchPolicy: 'cache-and-network',
    }).valueChanges.pipe(take(2)).subscribe(({data, loading, errors}) => {
      this.loading = loading;
      if (data) {
        Cookies.set('access_token', data.login.jwt, { secure: false });
        Cookies.set('refresh_token', data.login.refreshToken, { secure: false, expires: 14 });
        this.authStatus.changeAuthStatus(true);
        this.router.navigate(['/']);
      }
      if (errors) {
        for (const err of errors) {
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
      }
    });
  }
}
