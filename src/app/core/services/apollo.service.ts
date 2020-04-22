import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import * as Cookies from 'js-cookie';
import { AuthStatusService } from './auth-status.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Apollo } from 'apollo-angular';
import { REFRESHTOKEN_GQL, RefreshTokenResponse } from './../../core/graphql/mutations/refresh-token-gql';

@Injectable({
    providedIn: 'root'
})
export class ApolloService {
    private jwtHelper = new JwtHelperService();

    constructor(private apollo: Apollo, private authStatus: AuthStatusService) {
        if (this.jwtHelper.decodeToken(Cookies.get('access_token')) !== null) {
            if (this.jwtHelper.isTokenExpired(Cookies.get('access_token'))) {
                this.apollo.query<RefreshTokenResponse>({
                    query: REFRESHTOKEN_GQL,
                    variables: {
                        refreshToken: Cookies.get('refresh_token')
                    },
                    fetchPolicy: 'no-cache'
                }).pipe(
                    take(1),
                ).subscribe(({ data, errors }) => {
                    if (data) {
                        Cookies.set('access_token', data.refreshToken.jwt, { secure: false });
                        Cookies.set('refresh_token', data.refreshToken.refreshToken, { secure: false, expires: 14 });
                        this.authStatus.changeAuthStatus(true);
                    }
                    if (errors) {
                        console.log(errors);
                        this.authStatus.changeAuthStatus(false);
                        Cookies.remove('access_token');
                        Cookies.remove('refresh_token');
                        window.location.pathname = '/';
                    }
                });
            } else {
                this.authStatus.changeAuthStatus(true);
            }
        }
    }
}
