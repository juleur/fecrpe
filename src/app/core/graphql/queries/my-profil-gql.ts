import {gql} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';

import { User } from '../../models';

export interface Response {
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class MyProfilGQL extends Query<Response> {
  document = gql`
    query myProfil($userId: Int!) {
      myProfil(userId: $userId) {
        id
        username
        email
      }
    }
  `;
}
