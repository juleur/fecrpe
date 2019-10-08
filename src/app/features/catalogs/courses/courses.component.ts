import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoursesGQL } from 'src/app/core/graphql/queries/courses-gql';
import { RefresherCourse } from 'src/app/core';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  refresherCourses$: Observable<RefresherCourse[]> = of([
    {id: 34, year: '2039'},
    {id: 34, year: '2039'},
    {id: 34, year: '2039'},
    {id: 34, year: '2039'},
    {id: 34, year: '2039'},
    {id: 34, year: '2039'},
    {id: 34, year: '2039'},
    {id: 34, year: '2039'},
  ]);

  constructor(private coursesGQL: CoursesGQL) { }

  ngOnInit() {
    // this.refresherCourses$ = this.coursesGQL.
    //   watch().valueChanges.pipe(
    //     map(res => res.data.refresherCourses)
    //   );
  }
}
