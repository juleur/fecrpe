import gql from 'graphql-tag';
import { Session } from './../../../core/models/session.model';

export const SESSION_GQL = gql`
  query GetSessionCourse($sessionId: Int!) {
    getSessionCourse(sessionId: $sessionId) {
        id
        title
        type
        description
        recordedOn
        video {
          id
          path
        }
    }
  }
`;

export interface SessionResponse {
  getSessionCourse: Session;
}
