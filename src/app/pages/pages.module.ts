import { AnnouncementModule } from './announcement/announcement.module';
import { ChartsModule } from './charts/charts.module';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ImportComponent } from './import/import.component';


const PAGES_COMPONENTS = [
  PagesComponent,
  HomeComponent,
  ImportComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
    CurriculumModule,
    ChartsModule,
    AnnouncementModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
