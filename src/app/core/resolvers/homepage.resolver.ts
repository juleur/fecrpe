import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { HOMEPAGE_GQL, HomePageResponse } from './../graphql/queries/homepage-gql';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomepageResolver implements Resolve<HomePageResponse> {
  constructor(private apollo: Apollo) { }

  resolve(): Observable<any> | any {
    return this.apollo.query<HomePageResponse>({
      query: HOMEPAGE_GQL,
      fetchPolicy: 'cache-first'
    });
  }
}
