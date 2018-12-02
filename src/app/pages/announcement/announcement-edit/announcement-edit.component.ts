import { Location } from '@angular/common';
import { Component, OnInit, Input} from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'announcement-edit',
  templateUrl: './announcement-edit.component.html',
  styleUrls: ['./announcement-edit.component.scss']
})
export class AnnouncementEditComponent implements OnInit {
  
  announcement: string[];
  curriculumSubjects: string[];

  title: string;
  content: string;
  end_date: string;
  post_target: string[];
  announcementId;
  currentUserId;

  isT: Boolean;

  constructor(private _http: HttpService, private _auth: AuthService, private _data: DataService, private _router: Router, private _location: Location) { }

  ngOnInit() {
    if (this._auth.isAuth) {
      this.announcementId = localStorage.getItem("announcementId");
      this.currentUserId = localStorage.getItem("currentUserId");
      this.getAnnouncement();
      this.getCurriculum();
    } else if ( this._data.getRole() === "student") {
      this._router.navigate(['/']);
      alert('權限不足!');
    } else {
      this._router.navigate(['/']);
      alert('尚未登入!');
    }
  }

  putAnnouncement() {
    if (this.isVaild) {
      let data = this.getAnnouncementObject();
      this._http.putData('/announcement/posts/' + this.announcementId, data).then(
        observer => {
          observer.subscribe(
            data => {
              alert('公告編輯成功!');
              this._location.back();
            },
            error => {
              alert('公告編輯失敗，請檢查填寫內容');
            }
          );
        }
      );
    }
  }

  getAnnouncement() {
    this._http.getData('/announcement/posts/' + this.announcementId).then(
      observer => {
        observer.subscribe(
          data => {
            this.announcement = data;
            this.title = data["title"];
            this.content = data["content"];
            this.end_date = data["end_date"];
            this.post_target = data["post_target"];
          },
          error => {
            alert('資料讀取失敗，請稍候再試')
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
    object.created_user = this.currentUserId;
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

  isTeacher() {
    let role = this._data.getRole();
    if (role === "teacher") {
      this.isT = true;
    } else if (role === "student"){
      this.isT = false;
    }
  }

  isEmptyString(str: string) { return str && str.length > 0 }
  
}
