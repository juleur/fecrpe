import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginGQL } from 'src/app/core/graphql/queries/login-gql';
import * as Cookies from 'js-cookie';
import { AuthService } from 'src/app/core';
import { Observable } from 'apollo-link';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.auth.login(this.loginForm);
  }
}
