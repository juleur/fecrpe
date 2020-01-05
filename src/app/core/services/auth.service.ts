import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';
import { Apollo } from 'apollo-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private loggedInSubject = new BehaviorSubject<boolean>(this.loggedInSubjectStatus());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  private loggedInSubjectStatus(): boolean {
    if (
      this.jwtHelper.decodeToken(Cookies.get('access_token')) != null &&
      !this.jwtHelper.isTokenExpired(Cookies.get('access_token'))
    ) {
      return true;
    }
    return false;
  }
  changeAuthStatus(status: boolean): void {
    this.loggedInSubject.next(status);
  }

  getUserIDToken(): number {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken['userId'];
  }

  getUsernameToken(): string {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken['username'];
  }
}
