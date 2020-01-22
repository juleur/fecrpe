import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MY_REFRESHERCOURSE_GQL, MyRefresherCoursesResponse } from './my-courses-gql';
import { RefresherCourse } from './../../../core/models/refresher-course.model';
import { Apollo } from 'apollo-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as Cookies from 'js-cookie';
import { AuthService } from 'src/app/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'my-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  private querySub: Subscription;
  private jwtHelper = new JwtHelperService();
  refresherCourses: RefresherCourse[];

  constructor(
    private apollo: Apollo, private auth: AuthService,
    private toast: ToastrService, private router: Router
  ) {}

  ngOnInit() {
    if (
      this.jwtHelper.decodeToken(Cookies.get('access_token')) != null &&
      !this.jwtHelper.isTokenExpired(Cookies.get('access_token'))
    ) {
      this.querySub = this.apollo.watchQuery<MyRefresherCoursesResponse>({
        query: MY_REFRESHERCOURSE_GQL,
        variables: {
          userId: this.auth.getUserIDToken()
        },
        fetchPolicy: 'cache-and-network'
      }).valueChanges.subscribe(res => {
        if (res.hasOwnProperty('errors')) {
          for (const err of res.errors) {
            switch (err.extensions.statusText) {
              case 'Unauthorized':
                this.toast.error(`${err.message} !`, 'Mes Cours', {
                  positionClass: 'toast-top-full-width',
                  timeOut: 3000
                });
                this.apollo.client.clearStore();
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 2800);
                break;
              case 'Internal Server Error':
                this.toast.error(`${err.message} !`, 'Mes Cours', {
                  positionClass: 'toast-top-right',
                  timeOut: 5000
                });
                break;
            }
          }
        }
        if (res.data !== undefined) {
          this.refresherCourses = res.data.myRefresherCourses;
        }
      });
    }
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
