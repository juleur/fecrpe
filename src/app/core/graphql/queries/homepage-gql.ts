import gql from 'graphql-tag';

export const HOMEPAGE_GQL = gql`
    query HomepageData {
      subjectsEnum
      totalHoursCourses
    }
`;

export interface HomePageResponse {
  subjectsEnum: string[];
  totalHoursCourses: string;
}
