import gql from 'graphql-tag';
import { User } from './../../../core/models/user.model';

export const MYPROFIL_GQL = gql`
  query MyProfile($userId: Int!) {
    myProfile(userId: $userId) {
      username
      email
    }
  }
`;

export const UPDATEPROFIL_GQL = gql`
  mutation UpdateUser($input: UpdatedUser!) {
    updateUser(input: $input)
  }
`;

export interface MyProfilResponse {
  myProfile: User;
}

export interface UpdateUserResponse {
  updateUser: boolean;
}
