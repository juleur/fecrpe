import gql from 'graphql-tag';
import { RefresherCourse } from 'src/app/core';

export const COURSEDETAILS_GQL = gql`
  query GetRefresherCourse($refresherCourseId: Int!) {
    getRefresherCourse(refresherCourseId: $refresherCourseId) {
      id
      year
      isFinished
      price
      createdAt
      updatedAt
      isPurchased
      subject {
        id
        name
      }
      sessions {
        id
        # title
        # type
        # part
      }
      author {
        id
        username
        # fullname
      }
    }
  }
`;

export interface CourseDetailsResponse {
  getRefresherCourse: RefresherCourse;
}
