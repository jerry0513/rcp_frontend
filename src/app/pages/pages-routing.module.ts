import { AnnouncementComponent } from './announcement/announcement.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Component } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { ImportComponent } from './import/import.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'home',
    component: HomeComponent,
  }, {
    path: 'announcement',
    loadChildren: './announcement/announcement.module#AnnouncementModule',
  }, {
    path: 'curriculum/:week',
    component: CurriculumComponent,
  }, {
    path: 'curriculum',
    redirectTo: 'curriculum/1',
    pathMatch: 'full',
  }, {
    path: 'import',
    component: ImportComponent,
  }, {
    path: 'charts',
     loadChildren: './charts/charts.module#ChartsModule',
  }, {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
