import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, mapTo, map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import * as Cookies from 'js-cookie';
import { LoginGQL } from 'src/app/core/graphql/queries/login-gql';
import { RefreshTokenGQL } from '../graphql/mutations/refresh-token-gql';
import { Token } from '../models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TeacherService } from './teacher.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.tokenExpiration() ? false : true);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private loginGQL: LoginGQL,
    private refreshTokenGQL: RefreshTokenGQL,
    private teacherService: TeacherService,
  ) {}

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  tokenExpiration(): boolean {
    return this.jwtHelper.isTokenExpired();
  }

  getRefreshToken(refToken: string): Observable<Token> {
    return this.refreshTokenGQL.mutate({token: refToken}).pipe(
      catchError(err => of(err))
    );
  }

  login(formValue: FormGroup): Observable<boolean> {
    return this.loginGQL.watch({
      email: formValue.value.email,
      pwd: formValue.value.password,
    }).valueChanges.pipe(
      tap(res => {
        Cookies.set('access_token', res.data.token.jwt, { secure: true });
        Cookies.set('refresh_token', res.data.token.refreshToken, { secure: true, expires: 5 });
        this.isLoggedInSubject.next(true);
        this.teacherService.isTeacherSubject.next(true);
      }),
      mapTo(true),
      catchError(err => of(false))
    );
  }

  onLogout(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    this.isLoggedInSubject.next(false);
    this.teacherService.isTeacherSubject.next(false);
    this.apollo.getClient().resetStore();
  }
}
