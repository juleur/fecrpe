import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class SessionGQL extends Query<any> {
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
