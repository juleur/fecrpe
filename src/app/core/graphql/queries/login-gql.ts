import {gql} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';


import { Token, User } from '../../models';

export interface Response {
  token: Token;
  isTeacher: boolean;
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
        isTeacher
      }
    }
  `;
}
