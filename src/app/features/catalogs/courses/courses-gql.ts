import gql from 'graphql-tag';
import { RefresherCourse } from './../../../core/models/refresher-course.model';

export const REFRESHERCOURSE_GQL = gql`
  query GetRefresherCourses($subjectId: Int) {
    getRefresherCourses(subjectId: $subjectId) {
      id
      year
      isFinished
      price
      totalDuration
      isPurchased
      subject {
        id
        name
      }
      teachers {
        id
        username
      }
    }
  }
`;

export interface RefresherCoursesResponse {
  getRefresherCourses: RefresherCourse[];
}
