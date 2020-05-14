import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { GlobalService } from '../../../common/service/GlobalService';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../common/service/local.storage';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-property-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class PropertyStatisticComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    propertyName: '',
    propertySpecifications: ''
  };

  isTableLoading = true;
  
  constructor(
    private httpReq: HttpReqService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage //存储
  ) { }

  ngOnInit() {

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }

    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post('propertyInfo/propertyStatistical', null, this.reqObj, res => {
      this.isTableLoading = false;
      if (res.status == 200) {
        this.list = res.data.data;
        this.page.total = res.data.total;
      }
    });
  }

}
