import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyCoursesGQL } from 'src/app/core/graphql/queries/my-courses-gql';

import { RefresherCourse } from './../../../core/models/refresher-course.model';

@Component({
  selector: 'my-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  refresherCourses$: Observable<RefresherCourse[]> = of([
    { id: 23, year: '2018' },
    { id: 43, year: '2020' },
    { id: 19, year: '2017' },
    { id: 76, year: '2018' },
    { id: 34, year: '2020' },
    { id: 78, year: '2000' },
    { id: 45, year: '2034' },
    { id: 9, year: '2021' },
  ]);

  constructor(private myCoursesGQL: MyCoursesGQL) {}

  ngOnInit() {
    // this.refresherCourses$ = this.myCoursesGQL
    //   .watch().valueChanges.pipe(
    //     map(res => res.data.refresherCourses),
    //   );
  }
}
