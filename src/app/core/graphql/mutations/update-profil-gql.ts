import {gql} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';

import { User } from '../../models';

export interface Response {
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateProfilGQL extends Mutation<Response> {
  document = gql`
    mutation updateUser($userId: Int!) {
      updateUser(userId:$userId) {
        username
        email
      }
    }
  `;
}
