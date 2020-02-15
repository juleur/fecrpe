import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { SESSION_GQL, SessionResponse } from './../../features/catalogs/session-players/session-gql';
import { AuthStatusService } from '../services/auth-status.service';

@Injectable({
  providedIn: 'root'
})
export class SessionPlayersResolver implements Resolve<any> {
  constructor(private apollo: Apollo, private authStatus: AuthStatusService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | any {
    const rid = route.paramMap.get('id');
    const vid = route.paramMap.get('vid');
    return this.apollo.query<SessionResponse>({
      query: SESSION_GQL,
      variables: {
        input: {
          userId: this.authStatus.getUserIDToken(),
          refresherCourseId: rid,
          sessionId: vid
        }
      },
      fetchPolicy: 'cache-first'
    });
  }
}
