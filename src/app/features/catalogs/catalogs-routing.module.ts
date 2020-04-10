import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesComponent } from '../catalogs/courses/courses.component';
import { CourseDetailsComponent } from '../catalogs/course-details/course-details.component';
import { SessionPlayersComponent } from './session-players/session-players.component';

import { LoggedInGuard } from 'src/app/core/guards/logged-in.guard';

import { CoursesResolver } from 'src/app/core/resolvers/courses.resolver';
import { CourseDetailsResolver } from 'src/app/core/resolvers/course-details.resolver';
import { SessionPlayersResolver } from 'src/app/core/resolvers/session-players.resolver';

const routes: Routes = [
    { path: 'courses', component: CoursesComponent, resolve: { courses: CoursesResolver } },
    { path: 'courses/:id', component: CourseDetailsComponent, resolve: { course: CourseDetailsResolver } },
    {
        path: 'courses/:id/vid/:vid', component: SessionPlayersComponent,
        // resolve: { sessionPlayers: SessionPlayersResolver }, canActivate: [LoggedInGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogsRoutingModule { }
