import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  students: String[];
  teachers: String[];
  subjects: String[];
  sectionTime: String[];
  rollcallRecords: String[];
  rollcallBeacons: String[];
  rollcallCheck: String[];

  role: String = "teacher";
  direction: number = 1;
  property: string = null;

  constructor(private _http: HttpService, private _auth: AuthService) {
    if (this._auth.isAuth) {
      this.getStudents();
          // this.getTeachers();
    }
  }

  getStudents() {
    this._http.getData('/account/student_import/').then(
      observer => {
        observer.subscribe(
          data => {
            this.students = data;
            return data
          },
          error => {
          }
        );
      }
    );
  }
  
  getTeachers() {
    this._http.getData('/account/teacher_import/').then(
      observer => {
        observer.subscribe(
          data => {
            this.teachers = data;
            return data
          },
          error => {
          }
        );
      }
    );
  }

  getSubjects() {
    this._http.getData('/curriculum/subjects/').then(
      observer => {
        observer.subscribe(
          data => {
            this.subjects = data;
            return data
          },
          error => {
          }
        );
      }
    );
  }

  getSectionTime() {
    this._http.getData('/curriculum/section_time_import/').then(
      observer => {
        observer.subscribe(
          data => {
            this.sectionTime = data;
            return data
          },
          error => {
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
            this.rollcallRecords = data;
            return data
          },
          error => {
          }
        );
      }
    );
  }

  getRollCallBeacons() {
    this._http.getData('/roll_call/beacons/').then(
      observer => {
        observer.subscribe(
          data => {
            this.rollcallBeacons = data;
            return data
          },
          error => {
          }
        );
      }
    );
  }

  getRollCallCheck() {
    this._http.getData('/roll_call/roll_call_check/').then(
      observer => {
        observer.subscribe(
          data => {
            this.rollcallCheck = data;
            return data
          },
          error => {
          }
        );
      }
    );
  }

  getRole() {
    if (this._auth.isAuth) {
      for (let s in this.students) {
        if (this._auth.username === this.students[s]["user"]["username"]) {
          this.role = "student";
        }
      }
    }
    return this.role
  }

  sortData(data: String[], column: string) {
    this.property = column;
    this.direction = (this.property === column) ? this.direction * -1 : 1;
    data.sort((a,b)=>{
      if (typeof a[column] === "number") {
        if (this.direction == 1) {
          return b[column] - a[column]
        } else {
          return a[column] - b[column]
        }
      } else if (typeof a[column] === "string") {
        let nameA = a[column];
        let nameB = b[column];
        if (nameA < nameB) {
          return this.direction * 1;
        }
        if (nameA > nameB) {
          return this.direction * -1;
        }
        return 0;
      }
    });
  }

}