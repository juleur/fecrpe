import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginGQL } from 'src/app/core/graphql/queries/login-gql';
import { CookieService } from '@gorniv/ngx-universal';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginGQL: LoginGQL,
    private cookie: CookieService,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.loginGQL.watch({
      email: this.loginForm.value.email,
      pwd: this.loginForm.value.password,
    }).valueChanges.pipe(
      tap(res => {
        this.cookie.putObject('jwt', res.data.jwt);
        this.cookie.putObject('refresh_token', res.data.refreshToken);
      }),
      catchError(err => of(err))
    );
  }
}
