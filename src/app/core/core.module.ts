import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { throwIfAlreadyLoaded } from './guards/module-import.guard';

import { TopComponent } from './layouts/top/top.component';
import { HomepageComponent } from './layouts/homepage/homepage.component';
import { BottomComponent } from './layouts/bottom/bottom.component';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  {path: '', component: HomepageComponent},
];

@NgModule({
  declarations: [
    TopComponent, HomepageComponent, BottomComponent
  ],
  imports: [
    CommonModule, RouterModule.forRoot(routes),
    MaterialModule, BrowserAnimationsModule
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
