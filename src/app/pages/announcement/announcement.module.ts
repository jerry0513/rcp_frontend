import { AnnouncementComponent } from './announcement.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementAddComponent } from './announcement-add/announcement-add.component';
import { AnnouncementEditComponent } from './announcement-edit/announcement-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { 
    path: 'add', 
    component: AnnouncementAddComponent, 
  },  {
    path: 'edit/:id', 
    component: AnnouncementEditComponent, 
  },  {
    path: '',
    component: AnnouncementComponent,
  },
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [ RouterModule ],
  declarations: [
    AnnouncementComponent,
    AnnouncementAddComponent,
    AnnouncementEditComponent,
  ]
})
export class AnnouncementModule {}