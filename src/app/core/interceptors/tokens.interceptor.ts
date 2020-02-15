import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as Cookies from 'js-cookie';
import { take, tap, catchError } from 'rxjs/operators';
import { Token } from '../models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthStatusService } from '../services/auth-status.service';
import { throwError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';


const EXCLUDE_PATH: string[] = [
  '/auth/login',
  '/auth/signup'
];

@Injectable()
export class TokensInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient, private authStatus: AuthStatusService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('TokenInterceptor');
    for (const path of EXCLUDE_PATH) {
      if (req.url.includes(path)) {
        return next.handle(req);
      }
    }
    if (this.jwtHelper.decodeToken(Cookies.get('access_token')) !== null) {
      if (this.jwtHelper.isTokenExpired(Cookies.get('access_token'))) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access_token') || 'unknown'}`,
            'Refresh-Token': Cookies.get('refresh_token') || 'unknown'
          })
        };
        this.http.get<Token>('http://localhost:3054/api/ecrpe/refreshtoken', httpOptions ).pipe(
          take(1),
          tap(data => {
            Cookies.set('access_token', data.jwt, {secure: false});
            Cookies.set('refresh_token', data.refreshToken, { secure: false, expires: 14});
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
      return next.handle(this.updateReq(req));
    }
    return next.handle(req);
  }

  private updateReq(oldReq: HttpRequest<any>): HttpRequest<any> {
    return oldReq.clone({
      headers: oldReq.headers
        .set('Authorization', `Bearer ${Cookies.get('access_token') || 'unknown'}`)
        .set('Refresh-Token', Cookies.get('refresh_token') || 'unknown')
    });
  }
}
