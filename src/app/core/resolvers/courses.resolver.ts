import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { RefresherCoursesResponse, REFRESHERCOURSES_GQL } from 'src/app/features/catalogs/courses/courses-gql';

@Injectable({
  providedIn: 'root'
})
export class CoursesResolver implements Resolve<any> {
  constructor(private apollo: Apollo) {}

  resolve(): Observable<any> | any {
    return this.apollo.query<RefresherCoursesResponse>({
      query: REFRESHERCOURSES_GQL,
      variables: {
        input: {}
      },
      fetchPolicy: 'cache-first'
    });
  }
}
