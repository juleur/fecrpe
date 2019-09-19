import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenGQL extends Mutation {
  document = gql`
    mutation refreshToken($token: String!) {
      refreshToken(refreshToken: $token) {
        jwt
        refreshToken
      }
    }
  `;
}
