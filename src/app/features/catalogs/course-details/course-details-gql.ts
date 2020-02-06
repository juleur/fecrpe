import gql from 'graphql-tag';
import { RefresherCourse, Session } from 'src/app/core';

export const COURSEDETAILS_GQL = gql`
  query RefresherCourse($refresherCourseId: Int!) {
    refresherCourse(refresherCourseId: $refresherCourseId) {
      refresherCourse {
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
      sessions {
        id
        title
        section
        type
      }
    }
  }
`;

export interface CourseDetailsResponse {
  refresherCourse: RefresherCourse;
  sessions: Session[];
}

export const PURCHASEREFCOURSE_GQL = gql`
  mutation PurchaseRefresherCourse($input: PurchaseRefresherCourseInput!) {
    purchaseRefresherCourse(input: $input)
  }
`;

export interface PurchaseRefCourseResponse {
  purchaseRefresherCourse: boolean;
}
