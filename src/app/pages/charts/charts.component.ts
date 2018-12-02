import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'ngx-charts',
  styleUrls: ['./charts.component.scss'],
  templateUrl: './charts.component.html',
})
export class ChartsComponent {
  
  students: String[];
  subjects: String[];
  rollcallRecords: String[];
  dates: String[];

  username: String;
  userId: number;
  selectedSubject: number;
  selectedDate: String;

  isT: Boolean;
  isFilter: Boolean;
  sortColumn: String;
  
  constructor(private _http: HttpService, private _auth: AuthService, private _data: DataService, private _router: Router) {}

  ngOnInit() {
    if (this._auth.isAuth) {
      this.username = this._auth.username;
      this.getStudents();
      this.getSubjects();
      this.getRollCallRecords();
      this.isTeacher();
    } else {
      this._router.navigate(['/']);
      alert('尚未登入!');
    }  
  }

  getSubjects() {
    this._http.getData('/curriculum/subjects/').then(
      observer => {
        observer.subscribe(
          data => {
            this.subjects = data;
          },
          error => {
            alert('資料讀取失敗，請稍候再試')
          }
        );
      }
    );
  }

  getStudents() {
    this._http.getData('/account/student_import/').then(
      observer => {
        observer.subscribe(
          data => {
            this.students = data;
            this.userId = this.convertUsernameToId(this.username);
          },
          error => {
            alert('資料讀取失敗，請稍候再試')
          }
        );
      }
    );
  }

  getRollCallRecords() {
    this._http.getData('/roll_call/roll_call_record/').then(
      observer => {
        observer.subscribe(
          data => {
            let str = [];
            for (let i in Object.keys(data)) {
              let object = {"id_number": "", 
                "record_date": "", 
                "record_type": "", 
                "section": "",
                "subjects": "",
                "student":"" 
              };
              object.id_number = data[i]["student"].id_number;
              object.record_date = data[i].record_date;
              object.record_type = data[i].record_type;
              object.section = data[i]["section_time"].section;
              object.subjects = data[i]["section_time"].subjects;
              object.student = data[i]["student"]["user"].id;
              str.push(object);
            }
            this.rollcallRecords = str;           
          },
          error => {
            alert('資料讀取失敗，請稍候再試')
          }
        );
      }
    );
  }

  convertUsernameToId(username: String) {
    let id: number;
    this.students.forEach((item, index, array)=>{
      if (username === item['user']['username']){
        id = item['user']['id']
      }
    });
    return id
  }

  convertStudentIdToIdNumber(studentId) {
    let id
    this.students.forEach((item, index, array)=>{
      if (studentId === item['user']['id']){
        id = item['id_number']
      }
    });
    return id
  }

  sort(column) {
    if (column === "id") {
      this._data.sortData(this.rollcallRecords, "id_number");
    } else if (column === "date") {
      this._data.sortData(this.rollcallRecords, "record_date");
    } else if (column === "section") {
      this._data.sortData(this.rollcallRecords, "section");
    } else if (column === "type") {
      this._data.sortData(this.rollcallRecords, "record_type");
    }
  }

  isTeacher() {
    let role = this._data.getRole();
    if (role === "teacher") {
      this.isT = true;
    } else if (role === "student"){
      this.isT = false;
    }
  }
  
}
