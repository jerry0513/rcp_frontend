import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  constructor(private _http: HttpService, private _auth: AuthService, private _data: DataService, private _router: Router) { }

  ngOnInit() {
    if ( !this._auth.isAuth ) {
      this._router.navigate(['/']);
      alert('尚未登入!');
    } else if ( this._data.getRole() === "student") {
      this._router.navigate(['/']);
      alert('權限不足!');
    } else {
      this.getSubjects();
      this.getStudents();
      this.getTeachers();
    }
  }

  data: Object;
  displayData: Object;
  unit: String = "學生";
  year: String;
  semester: String;
  subjectsName: String;
  subjects: String[];
  students: String[];
  teachers: String[];
  teacherName: String;
  teacherList = [""];
  isShow: Boolean = false;
  isVaildExtension: Boolean = false;

  onFileChange(evt: any) {
    let fileName: String = evt.target.files[0].name;
    this.data = [];
    this.displayData = [];
    this.checkVaildExtension(fileName);
    if (this.isVaildExtension) {
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.displayData = XLSX.utils.sheet_to_json(ws, {header: 1});
        this.data = XLSX.utils.sheet_to_json(ws);
      };
      reader.readAsArrayBuffer(target.files[0]);
    }  
  }

  upload() {
    if (this.data && this.isVaildExtension) {
      let data = this.getJson(this.data, this.unit);
      let unitURL = this.getUnitURL(this.unit);
      if (this._auth.isAuth) {
        if (this.unit === '課程學生') {
          this._http.putData(unitURL, data).then(
            observer => {
              observer.subscribe(
                data => {
                  alert('資料匯入成功！');
                },
                error => {
                  alert('資料匯入失敗，請檢查匯入格式及資料是否已經匯入');
                }
              );
            }
          );
        } else {
          this._http.postData(unitURL, data).then(
            observer => {
              observer.subscribe(
                data => {
                  data
                  alert('資料匯入成功！')
                },
                error => {
                  if (this.unit === "課表節次") {
                    alert('資料匯入失敗，請檢查匯入格式及資料是否已經匯入');
                  } else {
                    alert('資料匯入失敗，請檢查匯入格式');
                  }
                }
              );
            }
          );
        }
      }
    } else {
      alert("請上傳檔案");
    }
  }

  getJson(data, unit) {
    switch(unit) { 
      case "學生": { 
        return JSON.stringify(this.getStudentObject(data));
      } 
      case "老師": { 
        return JSON.stringify(this.getTeacherObject(data));
      } 
      case "課程": { 
        return JSON.stringify(this.getSubjectsObject(data));
      } 
      case "課表節次": {
        return JSON.stringify(this.getSectionTimeObject(data));
      }
      case "課程學生": {
        return JSON.stringify(this.getCurriculumStudents(data));
      }
    }
  }

  getStudentObject(data) {
    let str = [];
    for (let k in Object.keys(data)) {
      let object = {"user":{"username": "", "first_name": "", "last_name": "","email": ""}, 
                "department": "", 
                "edu_type": "", 
                "edu_year": "", 
                "team_type": "", 
                "id_number": "", 
                "class_number": "",
                "unit_col": ""};
      object.user.username = data[k].username;
      object.user.first_name = data[k].first_name;
      object.user.last_name = data[k].last_name;
      object.user.email = data[k].email;
      object.department = data[k].department;
      object.edu_type = data[k].edu_type;
      object.edu_year = data[k].edu_year;
      object.team_type = data[k].team_type;
      object.id_number = data[k].id_number;
      object.class_number = data[k].class_number;
      object.unit_col = data[k].unit_col;
      str.push(object);
    }
    return str
  }

  getTeacherObject(data) {
    let str = [];
    for (let k in Object.keys(data)) {
      let object = {"user":{"username": "", "first_name": "", "last_name": "","email": ""}, 
                "department": "", 
                "time_case": "", 
                "job_title": "", 
                "unit_col": ""};
      object.user.username = data[k].username;
      object.user.first_name = data[k].first_name;
      object.user.last_name = data[k].last_name;
      object.user.email = data[k].email;
      object.department = data[k].department;
      object.time_case = data[k].time_case;
      object.job_title = data[k].job_title;
      object.unit_col = data[k].unit_col;
      str.push(object);
    }
    return str
  }

  getSubjectsObject(data) {
    let str = [];
    for (let k in Object.keys(data)) {
      let object = {"subjects_name": "", 
                "class_room": "", 
                "year": "", 
                "semester": "", 
                "teacher": ""};
      object.subjects_name = data[k].subjects_name;
      object.class_room = data[k].class_room;
      object.year = data[k].year;
      object.semester = data[k].semester;
      object.teacher = this.convertTeacherEmailToId(data[k].teacher);
      str.push(object);
    }
    return str
  }

  getSectionTimeObject(data) {
    let str = [];
    for (let k in Object.keys(data)) {
      let object = {"week": "", 
                "section": "", 
                "start_time": "", 
                "end_time": "", 
                "subjects": ""};
      object.week = data[k].week;
      object.section = data[k].section;
      object.start_time = data[k].start_time;
      object.end_time = data[k].end_time;
      object.subjects = this.convertSubjectNameToId(data[k].subjects);
      str.push(object);
    }
    return str
  }

  getCurriculumStudents(data) {
    let object = {subjects_name: "", 
                year: "", 
                semester: "", 
                teacher: "",
                members: []
                };

    object.subjects_name = this.subjectsName.toString();
    object.year = this.year.toString();
    object.semester = this.semester.toString();
    object.teacher = this.convertTeacherNameToId(this.teacherName);

    for (let k in Object.keys(data)) {
      object.members.push(this.convertStudentEmailToId(data[k].members));
    }

    return object
  }

  getUnitURL(unit: String): String {
    switch(unit) { 
      case "學生": { 
        return "/account/student_import/multi/"
      } 
      case "老師": { 
        return "/account/teacher_import/multi/"
      } 
      case "課程": { 
        return "/curriculum/subjects_import/multi/"
      } 
      case "課表節次": {
        return "/curriculum/section_time_import/multi/"
      }
      case "課程學生": {
        return "/curriculum/students_import/" + this.convertSubjectNameToId(this.subjectsName) + "/"
      }
    }
  }



  getSubjects() {
    this._http.getData('/curriculum/subjects_import/').then(
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
          },
          error => {
            alert('資料讀取失敗，請稍候再試')
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
          },
          error => {
            alert('資料讀取失敗，請稍候再試')
          }
        );
      }
    );
  }

  convertStudentEmailToId(studentEmail: String) {
    for (let i in this.students) {
      let email: String = this.students[i]["user"]["email"]
      if ( email === studentEmail ) {
        return this.students[i]["user"]["id"]
      }
    }
  }
  
  convertTeacherEmailToId(teacherEmail: String) {
    for (let i in this.teachers) {
      let email: String = this.teachers[i]["user"]["email"];
      let id = this.teachers[i]["user"]["id"];
      if ( email === teacherEmail ) {
        return id
      }
    }
  }

  convertTeacherNameToId(teacherName: String) {
    for (let i in this.teachers) {
      let name: String = this.teachers[i]["user"]["last_name"] + this.teachers[i]["user"]["first_name"]
      if ( name === teacherName ) {
        return this.teachers[i]["user"]["id"]
      }
    }
  }

  convertSubjectNameToId(subjectName: String) {
    for (let i in this.subjects) {
      let subjectId = this.subjects[i]["id"];
      if (this.subjects[i]["subjects_name"] === subjectName) {
        return subjectId
      }
    }
  }

  displaySubjectTeacher() {
    this.teacherList=[""];
    for (let i in this.subjects) {
      let subjectTeacher = this.subjects[i]["teacher"]
      if (this.subjects[i]["subjects_name"] === this.subjectsName) {
        for (let t in this.teachers) {
          if (this.teachers[t]["user"]["id"] == subjectTeacher) {
            this.teacherList.push(this.teachers[t]["user"]["last_name"] + this.teachers[t]["user"]["first_name"]);
          }
        }
      }
    }
  }

  isSelectedCurStudent() { 
    return this.unit === "課程學生" ? this.isShow = true : this.isShow = false 
  }

  checkVaildExtension(fileName: String) {
    let fileExtension: String = fileName.split('.').pop();
    if (fileExtension != 'xlsx' && 'xls') {
      alert('資料讀取失敗，只能上傳副檔名為xls或xlsx');
      this.isVaildExtension = false;
    } else {
      this.isVaildExtension = true;
    }
  }

}