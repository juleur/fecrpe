import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services';
import * as Cookies from 'js-cookie';
import { TeacherService } from '../services/teacher.service';

const EXCLUDE_PATH: string[] = [
  '/auth/login',
  '/auth/signup'
];

@Injectable()
export class AuthAfterwareInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('AUTHAFTERWARE');
    // prevent interceptor from triggering
    return next.handle(req).pipe(
      tap(res => {
          console.log(res);
      }),
    );
    // this.auth.isLoggedIn$.subscribe(v => console.log(v));
    // if (this.auth.isLoggedIn() && !!Cookies.get('access_token') && !this.auth.tokenExpiration) {
    //   req = this.cloneHeader(req);
    //   return next.handle(req).pipe(catchError(err => {
    //     if (err instanceof HttpErrorResponse && err.status === 401) {
    //       if (!this.refreshingToken) {
    //         this.refreshingToken = true;
    //         const refToken = Cookies.get('refresh_token');
    //         return this.auth.getRefreshToken(refToken).pipe(
    //           switchMap(tokens => {
    //               Cookies.set('access_token', tokens.jwt, { secure: true });
    //               Cookies.set('refresh_token', tokens.refreshToken, { secure: true, expires: 5 });
    //               req = this.cloneHeader(req);
    //               this.refreshingToken = false;
    //               this.teacher.isTeacherSubject.next(true);
    //               return next.handle(req);
    //           }),
    //         );
    //       } else {
    //         req = this.cloneHeader(req);
    //         return next.handle(req);
    //       }
    //     }
    //     this.teacher.isTeacherSubject.next(false);
    //   }));
  }
}

  // private cloneHeader(req: HttpRequest<any>): HttpRequest<any> {
  //   return req.clone({
  //     headers: req.headers.append('Authorization', `Bearer ${Cookies.get('access_token')}`)
  //   });
  // }

