import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services';

import * as Cookies from 'js-cookie';

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!!Cookies.get('access_token') && !this.auth.tokenExpiration) {
      req = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${Cookies.get('access_token')}`),
      });
      return next.handle(req);
    }
  }
}
