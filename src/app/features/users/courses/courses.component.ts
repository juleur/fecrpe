import { Component, OnInit } from '@angular/core';
import { REFRESHERCOURSE_GQL, RefresherCoursesResponse } from './my-courses-gql';
import { RefresherCourse } from './../../../core/models/refresher-course.model';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthStatusService } from 'src/app/core/services/auth-status.service';

@Component({
  selector: 'my-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  refresherCourses: RefresherCourse[];

  constructor(
    private apollo: Apollo, private authStatus: AuthStatusService,
    private toast: ToastrService, private router: Router
  ) {}

  ngOnInit() {
    this.apollo.watchQuery<RefresherCoursesResponse>({
      query: REFRESHERCOURSE_GQL,
      variables: {
        input: {
          byUserId: this.authStatus.getUserIDToken()
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
