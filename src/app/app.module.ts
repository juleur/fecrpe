import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';

import { ApolloService } from './core/services/apollo.service';
import { TokensInterceptor } from './core/interceptors/tokens.interceptor';
import { CorsInterceptor } from './core/interceptors/cors.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule,
        ApolloModule, HttpLinkModule, CoreModule, ToastrModule.forRoot()
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: (ApolloService) => () => null, deps: [ApolloService], multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokensInterceptor, multi: true },
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink) => {
                return {
                    cache: new InMemoryCache(),
                    // link: httpLink.create({ uri: 'http://79.137.126.0:6677/query'}),
                    link: httpLink.create({ uri: 'http://localhost:6677/query' }),
                    defaultOptions: {
                        query: {
                            errorPolicy: 'all',
                        },
                        watchQuery: {
                            errorPolicy: 'all',
                        },
                        mutate: {
                            errorPolicy: 'all'
                        }
                    }
                };
            },
            deps: [HttpLink]
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
