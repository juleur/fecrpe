import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CourseDetailsResponse, COURSEDETAILS_GQL } from 'src/app/features/catalogs/course-details/course-details-gql';

@Injectable({
  providedIn: 'root'
})
export class CourseDetailsResolver implements Resolve<any> {
  constructor(private apollo: Apollo) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | any {
    const id = route.paramMap.get('id');
    return this.apollo.query<CourseDetailsResponse>({
      query: COURSEDETAILS_GQL,
      variables: {
        refresherCourseId: id
      },
      fetchPolicy: 'no-cache'
    });
  }
}
