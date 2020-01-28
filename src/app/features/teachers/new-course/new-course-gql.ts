import gql from 'graphql-tag';
import { RefresherCourse } from 'src/app/core';

export const NEWCOURSE_GQL = gql`
  mutation CreateRefresherCourse($input: NewSessionInput!) {
    createRefresherCourse(input: $input)
  }
`;

export interface NewCourseResponse {
  createRefresherCourse: boolean;
}

export const REFRESHERSCOURSE_GQL = gql`
  query RefresherCourses($input: RefresherCourseInput!) {
    refresherCourses(input: $input) {
      id
      subject
      year
      isFinished
      isPurchased
      teachers {
        id
        username
      }
    }
  }
`;

export interface RefresherCoursesResponse {
  refresherCourses: [RefresherCourse];
}
