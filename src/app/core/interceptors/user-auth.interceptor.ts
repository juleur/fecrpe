import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services';
import * as Cookies from 'js-cookie';
import { TeacherService } from '../services/teacher.service';

const EXCLUDE_PATH: string[] = [
  '/auth/login',
  '/auth/signup'
];

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
  private refreshingToken = false;

  constructor(
    private auth: AuthService,
    private teacher: TeacherService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // prevent interceptor from triggering
    for (let path of EXCLUDE_PATH) {
      if (req.url.includes(path)) {
        return next.handle(req);
      }
    }
    const JWToken = Cookies.get('access_token') || '';
    const RefreshToken = Cookies.get('refresh_token') || '';
    const reqClone = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${JWToken}`)
        .set('Refresh-Token', RefreshToken)
    });
    return next.handle(reqClone).pipe();
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

