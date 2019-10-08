import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { GraphQLModule } from './graphql.module';

import { UserAuthInterceptor } from './core/interceptors/user-auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, AppRoutingModule, GraphQLModule,
    HttpClientModule, CoreModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserAuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
