import gql from 'graphql-tag';
import { RefresherCourse } from 'src/app/core';

export const NEWCOURSE_GQL = gql`
  mutation CreateRefresherCourse($input: NewSessionCourse!) {
    createRefresherCourse(input: $input)
  }
`;

export interface NewCourseResponse {
  createRefresherCourse: boolean;
}

export const REFRESHERCOURSE_GQL = gql`
  query GetRefresherCourses($subjectId: Int) {
    getRefresherCourses(subjectId: $subjectId) {
      id
      year
      isFinished
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
