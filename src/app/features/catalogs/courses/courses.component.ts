import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoursesGQL } from 'src/app/core/graphql/queries/courses-gql';
import { RefresherCourse } from 'src/app/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  refresherCourses$: Observable<RefresherCourse[]>;

  constructor(
    private coursesGQL: CoursesGQL
  ) { }

  ngOnInit() {
    this.refresherCourses$ = this.coursesGQL.
      watch().valueChanges.pipe(
        map(res => res.data.refresherCourses)
      );
  }
}
