import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthStatusService {
  private jwtHelper = new JwtHelperService();
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private teacherInSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedInSubject.asObservable();
  isTeacher$ = this.teacherInSubject.asObservable();

  constructor() {}

  changeAuthStatus(status: boolean): void {
    this.loggedInSubject.next(status);
    if (this.getTeacherToken()) {
      this.teacherInSubject.next(status);
    }
  }

  getUserIDToken(): number {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken[`userId`];
  }

  getUsernameToken(): string {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken[`username`];
  }

  getTeacherToken(): boolean {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken[`teacher`] ? true : false;
  }
}
