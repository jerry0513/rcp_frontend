import { DataService } from './../../../services/data.service';
import { AuthService } from './../../../services/auth.service';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;
  username: String;
  role: String;
  isT: Boolean;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private _router: Router,
              private _auth: AuthService,
              private _data: DataService) {
  }

  ngOnInit() {
    this.isTeacher();
    this.username = this._auth.username;
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  goToLogin() {
    this._router.navigate(['/auth/login']);
  }

  goToLogout() {
    this._router.navigate(['/auth/logout']);
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  isTeacher() {
    if (this._data.getRole() === "teacher") {
      this.role = "Teacher"
    } else if (this._data.getRole() === "student"){
      this.role = "Student"
    }
  }

}