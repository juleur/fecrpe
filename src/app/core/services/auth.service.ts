import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, mapTo } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Apollo } from 'apollo-angular';
import * as Cookies from 'js-cookie';
import { LoginGQL } from 'src/app/core/graphql/queries/login-gql';
import { RefreshTokenGQL } from '../graphql/mutations/refresh-token-gql';
import { Token } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private apollo: Apollo,
    private jwtHelper: JwtHelperService,
    private loginGQL: LoginGQL,
    private refreshTokenGQL: RefreshTokenGQL,
    ) {}

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  tokenExpiration(): boolean {
    return this.jwtHelper.isTokenExpired();
  }

  getRefreshToken(refToken: string): Observable<Token> {
    return this.refreshTokenGQL.mutate({
      token: refToken,
    }).pipe(
      catchError(err => of(err))
    );
  }

  login(formValue: FormGroup): Observable<boolean> {
    return this.loginGQL.watch({
      email: formValue.value.email,
      pwd: formValue.value.password,
    }).valueChanges.pipe(
      tap(res => {
        Cookies.set('access_token', res.data.jwt, { secure: true });
        Cookies.set('refresh_token', res.data.refreshToken, { secure: true, expires: 5 });
        this.isLoggedIn$.next(true);
      }),
      mapTo(true),
      catchError(err => of(false))
    );
  }

  onLogout(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    this.isLoggedIn$.next(false);
    this.apollo.getClient().resetStore();
  }
}
