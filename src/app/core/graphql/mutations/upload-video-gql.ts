import {gql} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';


@Injectable({
  providedIn: 'root',
})
export class UploadVideoGQL extends Mutation {
  document = gql`
    scalar Upload

    mutation UploadVideoMutation($file: Upload!) {
      uploadVideo(file: $file) {
        id
      }
    }
  `;
}
