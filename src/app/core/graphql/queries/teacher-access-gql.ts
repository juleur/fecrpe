import gql from 'graphql-tag';

export const IS_TEACHER_GQL = gql`
    query authTeacher($userId: Int!) {
      authTeacher(userId: $userId)
    }
`;

export interface IsTeacherResponse {
  authTeacher: boolean;
}
