import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> | boolean {
    return this.auth.isLoggedIn$.pipe(
      map(res => {
        if (res) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
