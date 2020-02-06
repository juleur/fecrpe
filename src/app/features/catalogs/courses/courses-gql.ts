import gql from 'graphql-tag';
import { RefresherCourse } from './../../../core/models/refresher-course.model';

export const REFRESHERCOURSES_GQL = gql`
  query RefresherCourses($input: RefresherCourseInput!) {
    refresherCourses(input: $input) {
      id
      subject
      year
      isFinished
      price
      totalDuration
      isPurchased
      teachers {
        id
        username
      }
    }
  }
`;

export interface RefresherCoursesResponse {
  refresherCourses: RefresherCourse[];
}
