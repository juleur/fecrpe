import { Component, OnInit } from '@angular/core';
import { MyCoursesGQL } from 'src/app/core/graphql/queries/my-courses-gql';
import { Observable } from 'apollo-link';
import { map } from 'rxjs/operators';

@Component({
  selector: 'my-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  refreshCourses$: Observable<any>;

  constructor(private myCoursesGQL: MyCoursesGQL) { }

  ngOnInit() {
    this.myCoursesGQL
                    .watch()
                    .valueChanges
                    .pipe(
                      map(result => result.data)
                    );
  }

}
