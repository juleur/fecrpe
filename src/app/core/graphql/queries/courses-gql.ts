import {gql} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';

import { RefresherCourse } from '../../models';

export interface Response {
  refresherCourses: RefresherCourse[];
}

@Injectable({
  providedIn: 'root',
})
export class CoursesGQL extends Query<Response> {
  document = gql`
    query courses($subject: Int) {
      courses(subject: $subject) {
        id
        year
        isFinished
        createdAt
        updatedAt
      }
    }
  `;
}
