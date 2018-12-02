import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from './../../../services/data.service';
import { HttpService } from './../../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'announcement-add',
  templateUrl: './announcement-add.component.html',
  styleUrls: ['./announcement-add.component.scss']
})
export class AnnouncementAddComponent implements OnInit {

  curriculumSubjects: string[];
  currentUser: string[];
  
  title: string;
  content: string;
  end_date: string;
  post_target: string[];

  constructor(private _http: HttpService, private _auth: AuthService, private _data: DataService, private _router: Router, private _location: Location) { }

  ngOnInit() {
    if (this._auth.isAuth) {
      this.getCurriculum();
      this.getCurrentUser();
    } else if ( this._data.getRole() === "student") {
      this._router.navigate(['/']);
      alert('權限不足!');
    } else {
      this._router.navigate(['/']);
      alert('尚未登入!');
    }
  }

  postAnnouncement() {
    if (this.isVaild) {
      let data = this.getAnnouncementObject();
      this._http.postData('/announcement/posts/', data).then(
        observer => {
          observer.subscribe(
            data => {
              alert('公告新增成功！');
              this._location.back();
            },
            error => {
              alert('公告新增失敗，請檢查填寫內容');
            }
          );
        }
      );
    }
  }

  getCurrentUser() {
    this._http.getData('/account/users/current_detail/').then(
      observer => {
        observer.subscribe(
          data => {
            this.currentUser = data;
          },
          error => {
            alert('資料讀取失敗，請稍候再試');
          }
        );
      }
    );
  }

  getCurriculum() {
    this._http.getData('/curriculum/subjects/').then(
      observer => {
        observer.subscribe(
          data => {
            this.curriculumSubjects = data;
          },
          error => {
            alert('資料讀取失敗，請稍候再試');
          }
        );
      }
    );
  }

  getAnnouncementObject() {
    let object = {
      "title":"",
      "content":"",
      "end_date":"",
      "created_user":"",
      "post_target":[],
    };
    
    object.title = this.title;
    object.content = this.content;
    object.end_date = this.end_date;
    object.created_user = this.currentUser["id"];
    for (let i in this.post_target) {
      object.post_target.push(this.post_target[i]);
    }
    return object
  }

  isVaild() {
    if (this.isEmptyString(this.title) && 
        this.isEmptyString(this.content) &&
        this.isEmptyString(this.end_date) &&
        this.post_target.length > 0) {
          return true
        } else {
          return false
        }
  }

  isEmptyString(str: string) { return str && str.length > 0 }
  
}
