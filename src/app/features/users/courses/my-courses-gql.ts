import gql from 'graphql-tag';
import { RefresherCourse } from './../../../core/models/refresher-course.model';

export const MY_REFRESHERCOURSE_GQL = gql`
  query MyRefresherCourses($userId: Int!) {
    myRefresherCourses(userId: $userId) {
      id
      year
      isFinished
      totalDuration
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


export interface MyRefresherCourseResponse {
  myRefresherCourses: RefresherCourse[];
}
