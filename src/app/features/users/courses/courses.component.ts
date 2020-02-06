import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { REFRESHERCOURSE_GQL, RefresherCoursesResponse } from './my-courses-gql';
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
      this.querySub = this.apollo.watchQuery<RefresherCoursesResponse>({
        query: REFRESHERCOURSE_GQL,
        variables: {
          input: {
            byUserId: this.auth.getUserIDToken()
          }
        },
        fetchPolicy: 'cache-and-network'
      }).valueChanges.subscribe(({data, errors}) => {
        if (data) {
          this.refresherCourses = data.refresherCourses;
        }
        if (errors) {
          for (const err of errors) {
            this.toast.error(`${err.message} !`, 'Mes Cours', {
              positionClass: 'toast-top-right',
              timeOut: 5000
            });
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
