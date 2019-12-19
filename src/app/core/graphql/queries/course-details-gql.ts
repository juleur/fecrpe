import {gql} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';

import { RefresherCourse } from '../../models';

export interface Response {
  refresherCourse: RefresherCourse;
}

@Injectable({
  providedIn: 'root',
})
export class CourseDetailsGQL extends Query<Response> {
  document = gql`
    query courseDetails($refresherCourse: Int) {
      courseDetails(refresherCourse: $refresherCourse) {
        id
        year
        isFinished
        price
        createdAt
        updatedAt
        subject {
          id
          name
        }
        sessions {
          id
          title
          type
          part
        }
      }
    }
  `;
}
