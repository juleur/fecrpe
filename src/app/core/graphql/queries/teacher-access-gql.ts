import gql from 'graphql-tag';

export const IS_TEACHER_GQL = gql`
    query IsTeacher($userId: Int!) {
      isTeacher(userId: $userId)
    }
`;

export interface IsTeacherResponse {
  isTeacher: boolean;
}
