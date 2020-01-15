import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import * as Cookies from 'js-cookie';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../services';
import { IS_TEACHER_GQL, IsTeacherResponse } from './../graphql/queries/teacher-access-gql';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanLoad {
  private jwtHelper = new JwtHelperService();
  constructor(
    private apollo: Apollo, private auth: AuthService,
    private router: Router, private toast: ToastrService
  ) {}

  canLoad(): Observable<boolean> | boolean {
    if (this.jwtHelper.decodeToken(Cookies.get('access_token')) === null) {
      return false;
    }
    return this.apollo.query<IsTeacherResponse>({
      query: IS_TEACHER_GQL,
      variables: {
        userId: this.auth.getUserIDToken()
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      tap(res => {
        if (res.hasOwnProperty('errors')) {
          for (const err of res.errors) {
            switch (err.extensions.statusText) {
              case 'Forbidden':
                this.toast.error(`${err.message}`, 'Portail Professeur', {
                  positionClass: 'toast-top-full-width',
                  timeOut: 3000
                });
                break;
              case 'Internal Server Error':
                this.toast.error(`${err.message}`, 'Portail Professeur', {
                  positionClass: 'toast-top-full-width',
                  timeOut: 3000
                });
                break;
            }
          }
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      }),
      map(res => res.data.isTeacher),
    );
  }
}
