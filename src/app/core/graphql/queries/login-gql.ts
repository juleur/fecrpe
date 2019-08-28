import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { User } from './../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Query<User> {
  document = gql`
    query auth($email: String!, $pwd: String!) {
      auth(email: $email, pwd: $pwd) {
        jwt
        refreshToken
      }
    }
  `;
}
