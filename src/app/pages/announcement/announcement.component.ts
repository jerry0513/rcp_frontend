import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from './../../services/data.service';
import { AuthService } from './../../services/auth.service';
import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  announcements: string[];
  currentUser: string[];
  
  isT: Boolean;

  constructor(private _http: HttpService, private _auth: AuthService, private _data: DataService, private _router: Router, private _location: Location) { }

  ngOnInit() {
    if (this._auth.isAuth) {
      this.isTeacher();
      this.getAnnouncements();
      this.getCurrentUser();
    } else {
      this._router.navigate(['/']);
      alert('尚未登入!');
    }
  }

  getAnnouncements() {
    this._http.getData('/announcement/posts/').then(
      observer => {
        observer.subscribe(
          data => {
            this.announcements = data;
          },
          error => {
            alert('資料讀取失敗，請稍候再試');
          }
        );
      }
    );
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

  deleteAnnouncement(id) {
    this._http.deleteData('/announcement/posts/' + id).then(
      observer => {
        observer.subscribe(
          data => {
            alert('刪除成功!');
            this.getAnnouncements();
          },
          error => {
            alert('資料讀取失敗，請稍候再試');
          }
        );
      }
    );
  }

  editAnnouncement(id) {
    localStorage.removeItem("announcementId");
    localStorage.setItem("announcementId", id.toString());
    localStorage.setItem("currentUserId", this.currentUser["id"]);
  }

  detailAnnouncement(id) {

  }

  sort(column) {
    if (column === "title") {
      this._data.sortData(this.announcements, "title");
    } else if (column === "post_date") {
      this._data.sortData(this.announcements, "post_date");
    } else if (column === "end_date") {
      this._data.sortData(this.announcements, "end_date");
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
