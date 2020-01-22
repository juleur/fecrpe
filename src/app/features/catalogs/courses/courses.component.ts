import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RefresherCourse } from 'src/app/core';
import { Apollo } from 'apollo-angular';

import { REFRESHERCOURSE_GQL, RefresherCoursesResponse } from './courses-gql';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  private querySub: Subscription;
  refresherCourses: RefresherCourse[];
  constructor(private apollo: Apollo, private toast: ToastrService) { }

  ngOnInit() {
    this.querySub = this.apollo.watchQuery<RefresherCoursesResponse>({
      query: REFRESHERCOURSE_GQL,
      fetchPolicy: 'cache-and-network'
    }).valueChanges.subscribe(res => {
      if (res.hasOwnProperty('errors')) {
        for (const err of res.errors) {
          this.toast.error(`${err.message}`, 'Se Connecter', {
            positionClass: 'toast-top-full-width',
            timeOut: 4000
          });
        }
      }
      if (res.data !== undefined) {
        this.refresherCourses = res.data.getRefresherCourses.filter(v => {
          if (v.isPurchased === true) {
            v.price = null;
            return v;
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
