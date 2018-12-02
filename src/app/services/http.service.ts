import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiServer = environment.apiServer + '/api';
  hostServer = environment.hostServer;

  constructor(private _http: HttpClient, private _auth: AuthService) { }

  private async _getHeader(isAuth: Boolean): Promise<HttpHeaders> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (isAuth) {
      if (!this._auth.isAuth) {
        await this._auth.refresh();
      }
      headers = headers.set('Authorization', 'Bearer ' + this._auth.token);
    }
    
    return headers;
  }

  // resource, ex: '/users/1/'
  // Read data.
  async getData(resource, isAuth = true) {
    let headers = await this._getHeader(isAuth)
    return this._http.get<any>(this.apiServer + resource, { headers: headers });
  }
  // Create data.
  async postData(resource, data, isAuth = true) {
    let headers = await this._getHeader(isAuth)
    return this._http.post<any>(this.apiServer + resource, data, { headers: headers });
  }
  // Update data.
  async putData(resource, data, isAuth = true) {
    let headers = await this._getHeader(isAuth)
    return this._http.put<any>(this.apiServer + resource, data, { headers: headers });
  }
  // Partial update data. 部分資料更新
  async patchData(resource, data, isAuth = true) {
    let headers = await this._getHeader(isAuth)
    return this._http.patch<any>(this.apiServer + resource, data, { headers: headers });
  }
  // Delete data.
  async deleteData(resource, isAuth = true) {
    let headers = await this._getHeader(isAuth)
    return this._http.delete<any>(this.apiServer + resource, { headers: headers });
  }

}
