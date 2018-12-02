import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { orgUnitItem } from '../../models/org-unit-models';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  orgUnits: [orgUnitItem];
  selectedOrgUnit?: orgUnitItem;
  dropdownBtText: String = '請選擇單位';
  account = '';
  password = '';
  isLoginSuccess = true;
  constructor(private _auth: AuthService, private _http: HttpService, private _router: Router) { }

  ngOnInit() {
    this._http.getData('/account/org_units/', false).then(
      observer => {
        observer.subscribe(
          data => {
            this.orgUnits = data;
          },
          error => {
            alert('單位列表讀取失敗，請稍後再試！');
          }
        );
      }
    );
  }

  onSelectOrgUnit(item?: orgUnitItem) {
    if (item) {
      this.selectedOrgUnit = item;
      this.dropdownBtText = '@' + item.org_code;
    }else{
      this.selectedOrgUnit = null;
      this.dropdownBtText = '單位管理者';
    }
  }

  async onLogin() {
    let username;
    if (this.selectedOrgUnit) {
      username = this.account + '@' + this.selectedOrgUnit.org_code;
    }else{
      username = this.account;
    }
    await this._auth.login(username, this.password)

    if (this._auth.loginStatus == 200) {
      this._router.navigate(['/']);
      this.isLoginSuccess = true;
    }else{
      this.isLoginSuccess = false;
    }
  }
}
