import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import * as Cookies from 'js-cookie';
import { Router } from '@angular/router';
import { AuthStatusService } from '../../services/auth-status.service';

@Component({
  selector: 'top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent {
  isUserLoggedIn$: Observable<boolean>;
  isTeacher$: Observable<boolean>;

  constructor(private apollo: Apollo, public authStatus: AuthStatusService, private router: Router) {
    this.isUserLoggedIn$ = this.authStatus.isLoggedIn$;
    this.isTeacher$ = this.authStatus.isTeacher$;
  }

  onLogout(): void {
    this.authStatus.changeAuthStatus(false);
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    this.apollo.client.clearStore();
    this.router.navigate(['/auth/login']);
  }
}
