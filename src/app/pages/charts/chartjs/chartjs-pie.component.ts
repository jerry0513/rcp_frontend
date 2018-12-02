import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { HttpService } from './../../../services/http.service';
import { Component, OnDestroy, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-chartjs-pie',
  template: `
    <chart type="pie" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsPieComponent implements OnChanges, OnDestroy {
  data: any;
  options: any;
  themeSubscription: any; 
  
  typeCount: number[] = [0,0,0];
  absentee: number = 0;
  
  @Input() selectedSubject: number;
  @Input() isT: Boolean;
  @Input() userId: number;
  @Input() rollcallRecords: String[];

  constructor(private theme: NbThemeService, private _http: HttpService, private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this._auth.isAuth) {
      this.themeSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._auth.isAuth) {
      this.countRecordType();
    }
  }

  getChart() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels: ['到課', '曠課', '請假',],
        datasets: [{
          data: [this.typeCount[2], this.typeCount[1], this.typeCount[0]],
          backgroundColor: [colors.successLight, colors.dangerLight, colors.warningLight],
        }],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: '總圖',
          fontSize: '18',
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          labels: {
            fontColor: "#000000",
          },
        },
      };
    });
  }

  countRecordType() {
    this.typeCount = [0,0,0];
    if (this.isT) {
      for (let i in this.rollcallRecords) {
        if (this.rollcallRecords[i]["subjects"] == this.selectedSubject) {
          if (this.rollcallRecords[i]["record_type"] === "到課") {
            this.typeCount[2] += 1;
          } else if (this.rollcallRecords[i]["record_type"] === "曠課") {
            this.typeCount[1] += 1;
          } else {
            this.typeCount[0] += 1;
          }
        }
      }
    } else {
      for (let i in this.rollcallRecords) {
        if (this.rollcallRecords[i]["student"] === this.userId) {
          if (this.rollcallRecords[i]["subjects"] == this.selectedSubject) {
            if (this.rollcallRecords[i]["record_type"] === "到課") {
              this.typeCount[2] += 1;
            } else if (this.rollcallRecords[i]["record_type"] === "曠課") {
              this.typeCount[1] += 1;
            } else {
              this.typeCount[0] += 1;
            }
          }
        }
      }
    }
    this.getChart();
  }
  
}
