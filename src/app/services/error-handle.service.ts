import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  constructor(private _router: Router) { }

  handle(error) {
    switch (error.status) {
      case 400:
        // BadRequest
        alert('無效的請求');
        break;
      case 401:
        // Unauthorized
        localStorage.clear();
        this._router.navigate(['/login']);
        break;
    }
  }
}
