import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';
import { CurriculumSubjectsList } from '../../../models/curriculum-subjects-list-models';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  @Input() week: number;
  curSubjectsList: [CurriculumSubjectsList];

  constructor(private _http: HttpService, private _auth: AuthService, private _data: DataService, private _router: Router) { }

  ngOnInit() {
    if (this._auth.isAuth) {
      this.getCurriculum();
    }
  }

  getCurriculum() {
    this._http.getData('/curriculum/subjects/').then(
      observer => {
        observer.subscribe(
          data => {
            this.curSubjectsList = data;
            // console.log(data);

            // let str = [];
            // for (let i in Object.keys(data)) {
            //   let object = {"id_number": "", 
            //     "record_date": "", 
            //     "record_type": "", 
            //     "section": "",
            //     "subjects": "",
            //     "student":"" 
            //   };
            //   object.id_number = data[i]["student"].id_number;
            //   object.record_date = data[i].record_date;
            //   object.record_type = data[i].record_type;
            //   object.section = data[i]["section_time"].section;
            //   object.subjects = data[i]["section_time"].subjects;
            //   object.student = data[i]["student"]["user"].id;
            //   str.push(object);
            // }
          },
          error => {
            alert('課表讀取失敗，請稍後再試！');
          }
        );
      }
    );
  }

  selectedWeek(subject) {
    return subject.section_times.filter(section_time => section_time.week == this.week);
  }
}
