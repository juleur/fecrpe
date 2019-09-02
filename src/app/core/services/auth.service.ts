import { Injectable } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookie: CookieService) { }

  onLogout(): void {
    this.cookie.remove('jwt');
    this.cookie.remove('refresh_token');
    this.cookie.remove('user_id');
    this.cookie.remove('username');
  }
}
