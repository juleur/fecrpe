import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyCoursesGQL } from 'src/app/core/graphql/queries/my-courses-gql';

import { RefresherCourse } from './../../../core/models/refresher-course.model';

@Component({
  selector: 'my-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  refresherCourses$: Observable<RefresherCourse[]>;

  constructor(
    private myCoursesGQL: MyCoursesGQL,
  ) { }

  ngOnInit() {
    this.refresherCourses$ = this.myCoursesGQL
      .watch().valueChanges.pipe(
        map(res => res.data.refresherCourses),
      );
  }
}
