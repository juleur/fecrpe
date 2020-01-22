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
        title
        # type
        # part
      }
      teachers {
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

export const PURCHASEREFCOURSE_GQL = gql`
  mutation PurchaseRefresherCourse($input: NewPurchaseRefresherCourse!) {
    purchaseRefresherCourse(input: $input) {
      id
    }
  }
`;

export interface PurchaseRefCourseResponse {
  purchaseRefresherCourse: RefresherCourse;
}
