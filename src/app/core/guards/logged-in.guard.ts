import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthStatusService } from './../services/auth-status.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private authStatus: AuthStatusService) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authStatus.isLoggedIn$;
  }
}
