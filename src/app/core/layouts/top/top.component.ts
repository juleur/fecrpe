import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services';
import * as Cookies from 'js-cookie';

@Component({
  selector: 'top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent {
  isUserLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService, private apollo: Apollo) {
    this.isUserLoggedIn$ = this.auth.isLoggedIn$;
  }

  onLogout(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    this.apollo.client.clearStore();
    this.auth.changeAuthStatus(false);
  }
}
