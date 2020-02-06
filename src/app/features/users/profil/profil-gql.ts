import gql from 'graphql-tag';
import { User } from './../../../core/models/user.model';

export const PROFILE_GQL = gql`
  query Profile($userId: Int!) {
    profile(userId: $userId) {
      username
      email
    }
  }
`;

export interface ProfileResponse {
  profile: User;
}

export const UPDATEPROFIL_GQL = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
    }
  }
`;

export interface UpdateUserResponse {
  updateUser: User;
}
