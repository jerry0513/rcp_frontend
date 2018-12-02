import { DataService } from './../services/data.service';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { MENU_ITEMS_STUDENT } from './pages-menu-student';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu;

  constructor(private _auth: AuthService, private _data: DataService) {}

  ngOnInit() {
    this.menu = MENU_ITEMS;
    if (this._auth.isAuth) {
      if (this._data.getRole() === "teacher") {
        this.menu = MENU_ITEMS;
      } else if (this._data.getRole() === "student") {
        this.menu = MENU_ITEMS_STUDENT;
      }
    }
  }
}


