import gql from 'graphql-tag';
import { Token } from './../../../core/models/token.model';

export const LOGIN_GQL = gql`
  query Login($input: UserLogin!) {
    login(input: $input) {
      jwt
      refreshToken
    }
  }
`;

export interface TokenResponse {
  login: Token;
}
