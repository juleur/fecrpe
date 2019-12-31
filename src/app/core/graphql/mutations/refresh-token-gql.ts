import gql from 'graphql-tag';
import { Token } from '../../models';

export const REFRESHTOKEN_GQL = gql`
    mutation RefreshToken {
      refreshToken {
        jwt
        refreshToken
      }
    }
`;

export interface RefreshTokenResponse {
  refreshToken: Token;
}
