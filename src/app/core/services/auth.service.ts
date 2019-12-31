import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as Cookies from 'js-cookie';
import { Apollo } from 'apollo-angular';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}
  private jwtHelper = new JwtHelperService();
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.tokenExpiration() ? false : true);

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  changeLoginStatus(status: boolean): void {
    if (status) {
      this.isLoggedInSubject.next(true);
    }
    this.isLoggedInSubject.next(false);
  }

  tokenExpiration(): boolean {
    return this.jwtHelper.isTokenExpired(Cookies.get('access_token'));
  }

  getUserIDToken(): number {
    const decodedToken = this.jwtHelper.decodeToken(Cookies.get('access_token'));
    return decodedToken['userId'] as number;
  }

  deauthentication(): void {
    this.isLoggedInSubject.next(false);
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    this.apollo.client.resetStore();
  }
}
