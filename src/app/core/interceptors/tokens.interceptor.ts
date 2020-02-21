import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpResponse, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as Cookies from 'js-cookie';
import { map, catchError, tap, take, switchMap, finalize, filter } from 'rxjs/operators';
import { AuthStatusService } from '../services/auth-status.service';
import { EMPTY, Observable, BehaviorSubject } from 'rxjs';
import { Token } from '../models';

const EXCLUDE_PATH: string[] = [
  '/auth/login',
  '/auth/signup'
];

@Injectable()
export class TokensInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private http: HttpClient, private authStatus: AuthStatusService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    for (const path of EXCLUDE_PATH) {
      if (window.location.pathname.includes(path)) {
        return next.handle(req);
      }
    }
    return next.handle(this.updateReq(req)).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          if (event.body.hasOwnProperty('errors')) {
            for (const err of event.body.errors) {
              throw (new HttpErrorResponse({ headers: event.headers, status: err.extensions.statusCode, statusText: err.extensions.statusText, url: event.url }));
            }
          }
        }
        return event;
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          switch (err.statusText) {
            case 'Token Expired':
              return this.handleRefreshTokens(req, next);
            case 'Unauthorized':
              this.authStatus.changeAuthStatus(false);
              Cookies.remove('access_token');
              Cookies.remove('refresh_token');
              window.location.pathname = '/';
          }
        }
        return EMPTY;
      }),
    );
  }

  private handleRefreshTokens(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenStatusSubject.next(false);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`,
          'Refresh-Token': Cookies.get('refresh_token')
        })
      };
      return this.http.get<Token>('http://localhost:3054/api/ecrpe/refreshtoken', httpOptions)
        .pipe(
          tap(data => {
            Cookies.set('access_token', data.jwt, { secure: false });
            Cookies.set('refresh_token', data.refreshToken, { secure: false, expires: 14 });
            this.authStatus.changeAuthStatus(true);
          }),
          switchMap(() => {
            this.tokenStatusSubject.next(true);
            return next.handle(this.updateReq(request));
          }),
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              this.authStatus.changeAuthStatus(false);
              Cookies.remove('access_token');
              Cookies.remove('refresh_token');
              window.location.pathname = '/';
            }
            return EMPTY;
          }),
          finalize(() => this.isRefreshingToken = false)
        );
    } else {
      return this.tokenStatusSubject.pipe(
        filter(status => status !== true),
        take(1),
        switchMap(() => next.handle(this.updateReq(request)))
      );
    }
  }

  private updateReq(oldReq: HttpRequest<any>): HttpRequest<any> {
    return oldReq.clone({
      headers: oldReq.headers
        .set('Authorization', `Bearer ${Cookies.get('access_token') || 'unknown'}`)
        .set('Refresh-Token', Cookies.get('refresh_token') || 'unknown')
    });
  }
}
