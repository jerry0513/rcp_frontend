import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as sha256 from 'sha256';
import { Router } from '@angular/router';
import { ErrorHandleService } from './error-handle.service';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiServer = environment.apiServer + '/api';
  hostServer = environment.hostServer;

  loginStatus;
  username: String;
  private _accessToken: String;
  private _refreshToken: String;
  private _isAuth: Boolean = false;

  constructor(private _http: HttpClient, private _router: Router, private _errorHandler: ErrorHandleService) {
    this._getTokenFromLocalStorage();
  }

  private _getTokenFromLocalStorage() {
    if (localStorage.getItem('access') != null && localStorage.getItem('refresh') != null) {
      this._accessToken = localStorage.getItem('access');
      this._refreshToken = localStorage.getItem('refresh');
      this.username = localStorage.getItem('username');
      this._isAuth = true;
    } else {
      this._isAuth = false;
    }
  }

  get token(): String {
    return this._accessToken;
  }

  get isAuth(): Boolean {
    if (this._isAuth) {
      this.verify().then( v => {
        return v
      })
    }
    return this._isAuth;
  }

  private setAccessToken(token) {
    localStorage.setItem('access', token);
    this._accessToken = token;
  }

  private setRefreshToken(token) {
    localStorage.setItem('refresh', token);
    this._refreshToken = token;
  }

  private setUsername(token) {
    localStorage.setItem('username', token);
    this.username = token;
  }

  async login(username: String, password: String) {
    const secretPassword = sha256(password);
    const url = this.apiServer + '/token/';
    const body = JSON.stringify({ username: username, password: secretPassword });
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    await this._http.post<any>(url, body, { headers: headers }).toPromise().then(
      data => {
        this.setAccessToken(data.access);
        this.setRefreshToken(data.refresh);
        this.setUsername(username);
        this._isAuth = true;
        this.loginStatus = 200;
        this.username = username;
    }).catch(error => {
      this._isAuth = false;
      this.loginStatus = error.status;
      this.username = "";
    } )
  }

  logout () {
    localStorage.clear();
    this.username = "";
    this._isAuth = false;
  }

  async refresh() {
    const url = this.apiServer + '/token/refresh/';
    const body = JSON.stringify({ refresh: this._refreshToken });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    await this._http.post<any>(url, body, { headers: headers }).toPromise().then(result => {
      this.setAccessToken(result.access);
    }).catch(error => {
      this._isAuth = false;
      this._errorHandler.handle(error);
    })

  }

  async verify():Promise<Boolean> {
    const url = this.apiServer + '/token/verify/';
    const body = JSON.stringify({ token: this._accessToken });
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    let response = await this._http.post<any>(url, body, { headers: headers, observe: 'response' }).toPromise();
    if (response.status == 200) {
      return true;
    }
    return false;
  }

}
