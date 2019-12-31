import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../services';
import { REFRESHTOKEN_GQL, RefreshTokenResponse } from './../graphql/mutations/refresh-token-gql';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private apollo: Apollo
  ) {}

  canActivate(): Observable<boolean> | boolean {
    if (this.auth.tokenExpiration()) {
      return this.apollo.mutate<RefreshTokenResponse>({
        mutation: REFRESHTOKEN_GQL,
        fetchPolicy: 'no-cache'
      }).pipe(
        tap(v => console.log(v)),
        map(res => {
          if (res.data) {
            Cookies.set('access_token', res.data.refreshToken.jwt, { secure: false });
            Cookies.set('refresh_token', res.data.refreshToken.refreshToken, { secure: false, expires: 14 });
            return true;
          } else {
            this.router.navigate(['/auth/login']);
            this.apollo.client.resetStore();
            return false;
          }
        }),
      );
    }
    return true;
  }
}
