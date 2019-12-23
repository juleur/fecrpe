import gql from 'graphql-tag';

export const SIGNUP_GQL = gql`
  mutation createUser($input: NewUser!){
    createUser(input: $input)
  }
`;

export interface SignupResponse {
  createUser: boolean;
}
