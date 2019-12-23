import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Cookies from 'js-cookie';
import { Apollo } from 'apollo-angular';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) { }

  private jwtHelper = new JwtHelperService();
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.tokenExpiration() ? false : true);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  tokenExpiration(): boolean {
    return this.jwtHelper.isTokenExpired();
  }

  getUserIDToken(): number {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken['userId'] as number;
  }

  changeLoginStatus(status: boolean): void {
    if (status) {
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  onLogout(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    this.isLoggedInSubject.next(false);
    this.apollo.client.resetStore();
  }
}
