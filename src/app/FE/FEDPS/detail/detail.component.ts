import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { any } from 'types/underscore';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  oldid; // 带过来的老人id
  // 查询老人基本信息
  olderInfo; 
  queryParams = {
    page: 0,
    size: 20,
    name: '',
    cardid: '',
  };
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.oldid = this.route.snapshot.paramMap.get('id');
    if(this.oldid) this.getInfo(this.oldid);
    console.error(this.oldid);
  }

  // 获取老人基本信息
  getInfo(id){
    this.httpReq.post('consumerRegistration/detail', null, {id: id}, res => {
      if(res.code === 0){
        this.olderInfo = res.data;
        if(res.data.putsRecordList instanceof Array && res.data.putsRecordList.length){
          this.dataArray = [];
          this.dataArray = this.dataArray.concat(res.data.putsRecordList);
        }
      }
    })
  }

}
