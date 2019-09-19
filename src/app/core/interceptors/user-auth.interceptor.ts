import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services';
import * as Cookies from 'js-cookie';

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
  private refreshingToken = false;

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.auth.isLoggedIn() && !!Cookies.get('access_token') && !this.auth.tokenExpiration) {
      req = this.cloneHeader(req);
      return next.handle(req).pipe(catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          if (!this.refreshingToken) {
            this.refreshingToken = true;
            const refToken = Cookies.get('refresh_token');
            return this.auth.getRefreshToken(refToken).pipe(
              switchMap(tokens => {
                  Cookies.set('access_token', tokens.jwt, { secure: true });
                  Cookies.set('refresh_token', tokens.refreshToken, { secure: true, expires: 5 });
                  req = this.cloneHeader(req);
                  this.refreshingToken = false;
                  return next.handle(req);
              }),
            );
          } else {
            req = this.cloneHeader(req);
            return next.handle(req);
          }
        }
      }));
    }
  }

  private cloneHeader(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      headers: req.headers.append('Authorization', `Bearer ${Cookies.get('access_token')}`)
    });
  }
}
