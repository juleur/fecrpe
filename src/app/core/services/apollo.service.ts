import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { tap, take, catchError } from 'rxjs/operators';
import * as Cookies from 'js-cookie';
import { AuthStatusService } from './auth-status.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApolloService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private authStatus: AuthStatusService, private router: Router) {
    if (this.jwtHelper.decodeToken(Cookies.get('access_token')) !== null) {
      if (this.jwtHelper.isTokenExpired(Cookies.get('access_token'))) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access_token')}`,
            'Refresh-Token': Cookies.get('refresh_token')
          })
        };
        this.http.get<Token>('http://localhost:3054/api/ecrpe/refreshtoken', httpOptions).pipe(
          take(1),
          tap(data => {
            Cookies.set('access_token', data.jwt, { secure: false });
            Cookies.set('refresh_token', data.refreshToken, { secure: false, expires: 14 });
            this.authStatus.changeAuthStatus(true);
          }),
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              this.authStatus.changeAuthStatus(false);
              Cookies.remove('access_token');
              Cookies.remove('refresh_token');
              this.router.navigate(['/auth/login']);
            }
            return EMPTY;
          })
        );
      } else {
        this.authStatus.changeAuthStatus(true);
      }
    }
  }
}
