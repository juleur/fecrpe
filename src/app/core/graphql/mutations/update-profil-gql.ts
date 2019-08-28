import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class UpdateProfilGQL extends Mutation {
  document = gql`
    mutation updateUser($userId: Int!) {
      updateUser(userId:$userId) {
        username
        email
      }
    }
  `;
}
