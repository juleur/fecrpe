import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import * as Cookies from 'js-cookie';
import { AuthStatusService } from './auth-status.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models';
import { Apollo } from 'apollo-angular';
import { REFRESHTOKEN_GQL, RefreshTokenResponse } from './../../core/graphql/mutations/refresh-token-gql';

@Injectable({
  providedIn: 'root'
})
export class ApolloService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private apollo: Apollo, private authStatus: AuthStatusService) {
    if (this.jwtHelper.decodeToken(Cookies.get('access_token')) !== null) {
      if (this.jwtHelper.isTokenExpired(Cookies.get('access_token'))) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access_token')}`,
            'Refresh-Token': Cookies.get('refresh_token')
          })
        };
        this.apollo.query<RefreshTokenResponse>({
          query: REFRESHTOKEN_GQL,
          variables: {
            refreshToken: Cookies.get('refresh_token')
          },
          fetchPolicy: 'no-cache'
        }).pipe(
          take(1),
        ).subscribe(({data, errors}) => {
          if (data) {
            Cookies.set('access_token', data.token.jwt, { secure: false });
            Cookies.set('refresh_token', data.token.refreshToken, { secure: false, expires: 14 });
            this.authStatus.changeAuthStatus(true);
          }
          if (errors) {
            console.log(errors);
            // this.authStatus.changeAuthStatus(false);
            // Cookies.remove('access_token');
            // Cookies.remove('refresh_token');
            // window.location.pathname = '/';
          }
        });
        // this.http.get<Token>('http://localhost:3054/api/ecrpe/refreshtoken', httpOptions)
        //   .pipe(
        //     take(1),
        //     catchError(err => {
        //       if (err instanceof HttpErrorResponse) {
        //         this.authStatus.changeAuthStatus(false);
        //         Cookies.remove('access_token');
        //         Cookies.remove('refresh_token');
        //         window.location.pathname = '/';
        //       }
        //       return EMPTY;
        //     })
        // ).subscribe(data => {
        //   Cookies.set('access_token', data.jwt, { secure: false });
        //   Cookies.set('refresh_token', data.refreshToken, { secure: false, expires: 14 });
        //   this.authStatus.changeAuthStatus(true);
        // });
      } else {
        this.authStatus.changeAuthStatus(true);
      }
    }
  }
}
