import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { REFRESHTOKEN_GQL, RefreshTokenResponse } from './../graphql/mutations/refresh-token-gql';
import { AuthService } from '../services';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class KeepLoggedInGuard implements CanActivate {
  constructor(private apollo: Apollo, private auth: AuthService) {}
  private jwtHelper = new JwtHelperService();

  canActivate(): Observable<boolean> | boolean {
    if (this.jwtHelper.decodeToken(Cookies.get('access_token')) == null) {
      this.apollo.client.clearStore();
      return false;
    }
    if (this.jwtHelper.isTokenExpired(Cookies.get('access_token'))) {
      return this.apollo.mutate<RefreshTokenResponse>({
        mutation: REFRESHTOKEN_GQL,
        fetchPolicy: 'no-cache'
      }).pipe(
        map(res => {
          if (res.data) {
            Cookies.set('access_token', res.data.refreshToken.jwt, { secure: false });
            Cookies.set('refresh_token', res.data.refreshToken.refreshToken, { secure: false, expires: 14 });
            this.auth.changeAuthStatus(true);
            return true;
          } else {
            this.apollo.client.clearStore();
            this.auth.changeAuthStatus(false);
            return false;
          }
        }),
      );
    }
    return true;
  }
}
