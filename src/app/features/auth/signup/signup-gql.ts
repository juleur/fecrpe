import gql from 'graphql-tag';

export const SIGNUP_GQL = gql`
  mutation createUser($input: NewUserInput!){
    createUser(input: $input)
  }
`;

export interface SignupResponse {
  createUser: boolean;
}
