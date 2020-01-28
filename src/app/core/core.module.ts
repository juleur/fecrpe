import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { throwIfAlreadyLoaded } from './guards/module-import.guard';

import { TopComponent } from './layouts/top/top.component';
import { HomepageComponent } from './layouts/homepage/homepage.component';
import { BottomComponent } from './layouts/bottom/bottom.component';

import { SharedModule } from './../shared/shared.module';
import { LoaderComponent } from '../shared/components/loader/loader.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
];

@NgModule({
  declarations: [
    TopComponent, HomepageComponent, BottomComponent
  ],
  imports: [
    CommonModule, RouterModule.forRoot(routes), SharedModule
  ],
  exports: [
    RouterModule, TopComponent, HomepageComponent, BottomComponent
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
