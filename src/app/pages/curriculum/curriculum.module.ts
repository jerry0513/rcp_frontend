import { SubjectComponent } from './subject/subject.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumComponent } from './curriculum.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [CurriculumComponent, SubjectComponent]
})
export class CurriculumModule { }
