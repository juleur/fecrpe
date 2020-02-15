import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStatusService } from './../services/auth-status.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authStatus: AuthStatusService, private router: Router) {}
  canActivate(): Observable<boolean> | boolean {
    return this.authStatus.isLoggedIn$.pipe(
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
