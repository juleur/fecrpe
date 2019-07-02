import { NgModule, Optional, SkipSelf, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { throwIfAlreadyLoaded } from './guards/module-import.guard';

import { TopComponent } from './layouts/top/top.component';
import { HomepageComponent } from './layouts/homepage/homepage.component';
import { BottomComponent } from './layouts/bottom/bottom.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
];

@NgModule({
  declarations: [
    TopComponent, HomepageComponent, BottomComponent
  ],
  imports: [
      CommonModule, RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule, TopComponent, HomepageComponent, BottomComponent
  ]
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
