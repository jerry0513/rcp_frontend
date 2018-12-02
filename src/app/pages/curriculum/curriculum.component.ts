import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Output } from '@angular/core';
import { TABS } from './curriculum-tabs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss']
})
export class CurriculumComponent implements OnInit {
  week: number;

  constructor(private _route: ActivatedRoute, private _router: Router, private _auth: AuthService) { }

  ngOnInit() {
    if (this._auth.isAuth) {
      this._route.params.subscribe(params => {
        this.week = params['week'];
      });
    } else {
      this._router.navigate(['/']);
      alert('尚未登入!');
    }
  }

  tabs = TABS;
}