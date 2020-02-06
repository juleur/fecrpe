import gql from 'graphql-tag';
import { Session } from './../../../core/models/session.model';
import { User, Video } from 'src/app/core';
import { ClassPaper } from 'src/app/core/models/class-paper.model';

export const SESSION_GQL = gql`
  query sessionCourse($input: SessionInput!) {
    sessionCourse(input: $input) {
      session {
        id
        title
        section
        type
        description
        sessionNumber
        recordedOn
      }
      video {
        id
        path
      }
      classPapers {
        id
        title
        path
      }
      teacher {
        id
        username
      }
    }
  }
`;

export interface SessionResponse {
  session: Session;
  video: Video;
  classPapers: ClassPaper[];
  teacher: User;
}

export const PLAYERCHECKUSER = gql`
  query PlayerCheckUser {
    playerCheckUser
  }
`;

export interface PlayerCheckUserResponse {
  playerCheckUser: boolean;
}
