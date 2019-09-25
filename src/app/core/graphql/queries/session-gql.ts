import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { Session, Video } from '../../models';

export interface Response {
  session: Session;
  video: Video;
}

@Injectable({
  providedIn: 'root',
})
export class SessionGQL extends Query<Response> {
  document = gql`
    query mySessionPlayer($sessionId: Int!, $videoId: Int!) {
      session(sessionId: $sessionId) {
        id
        title
        type
        description
        part
        recordedOn
      }
      video(videoId: $videoId) {
        id
        uuid
        path
        duration
      }
    }
  `;
}
