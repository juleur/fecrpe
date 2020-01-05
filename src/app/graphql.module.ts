import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink, execute } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as Cookies from 'js-cookie';
import { REFRESHTOKEN_GQL } from './core/graphql/mutations/refresh-token-gql';

const uri = 'http://localhost:6677/query'; // <-- add the URL of the GraphQL server here

const authLink = createHttpLink({uri});

const headersMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${Cookies.get('access_token') || 'unknown'}`,
      'Refresh-Token': Cookies.get('refresh_token') || 'unknown'
    }
  });
  return forward(operation);
});

const errorAfterware = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions !== undefined) {
        switch (err.extensions.statusText) {
          case 'Token Expired':
            const refTokenOp = {
              query: REFRESHTOKEN_GQL,
              context: operation.getContext()
            };
            execute(authLink, refTokenOp).subscribe(res => {
              if (res.data) {
                Cookies.set('access_token', res.data.refreshToken.jwt, { secure: false });
                Cookies.set('refresh_token', res.data.refreshToken.refreshToken, { secure: false, expires: 14 });
              }
            });
            return forward(operation);
          case 'Unauthorized':
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            break;
        }
      }
    }
  }
});


export function createApollo() {
  return {
    cache: new InMemoryCache(),
    link: ApolloLink.from([headersMiddleware, errorAfterware, authLink]),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
   };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
