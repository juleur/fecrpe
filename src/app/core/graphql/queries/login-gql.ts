import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { Token } from '../../models';

export interface Response {
  token: Token;
}

@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Query<Response> {
  document = gql`
    query auth($email: String!, $pwd: String!) {
      auth(email: $email, pwd: $pwd) {
        jwt
        refreshToken
      }
    }
  `;
}
