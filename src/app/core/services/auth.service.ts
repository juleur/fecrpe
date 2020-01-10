import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';
import { Apollo } from 'apollo-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { REFRESHTOKEN_GQL, RefreshTokenResponse } from './../graphql/mutations/refresh-token-gql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private apollo: Apollo) {
    if (this.jwtHelper.decodeToken(Cookies.get('access_token')) !== null) {
      if (this.jwtHelper.isTokenExpired(Cookies.get('access_token'))) {
        this.apollo.mutate<RefreshTokenResponse>({
          mutation: REFRESHTOKEN_GQL,
          fetchPolicy: 'no-cache'
        }).pipe(
          tap(res => {
            if (res.data) {
              Cookies.set('access_token', res.data.refreshToken.jwt, { secure: false });
              Cookies.set('refresh_token', res.data.refreshToken.refreshToken, { secure: false, expires: 14 });
              this.loggedInSubject.next(true);
            } else {
              this.apollo.client.clearStore();
            }
          })
        ).subscribe();
      } else {
        this.loggedInSubject.next(true);
      }
    }
  }

  changeAuthStatus(status: boolean): void {
    this.loggedInSubject.next(status);
  }

  getUserIDToken(): number {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken['userId'];
  }

  getUsernameToken(): string {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken['username'];
  }
}
