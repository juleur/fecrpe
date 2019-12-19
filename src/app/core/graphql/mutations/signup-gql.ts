import {gql} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';


import { User } from './../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SignupGQL extends Mutation {
  document = gql`
    mutation createUser($email: String!, $username: String!, $password: String!) {
      createUser(email: $email, username: $username, password: $password) {
        username
      }
    }
  `;
}
