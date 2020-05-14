import { Component, OnInit } from '@angular/core';
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as _ from 'underscore';

@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan.component.html',
  styleUrls: ['./care-plan.component.css']
})
export class CarePlanComponent implements OnInit {

  oldmanId: String; // 老人id
  olderInfo = { // 老人信息
    name: '',
    sex: '',
    age: '',
    bedNum: '',
    level: '',
    pastMedHistory: '',
    nowMedHistory: '',
    actAbility: '',
    character: '',
    foodTaboo: ''
  };
  Loading:Boolean; // loading

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.oldmanId = this.route.snapshot.paramMap.get('olderId');
    this.getOlderInfo();
  }

  // 获取老人基本信息
  getOlderInfo(){
    this.Loading = true;
    this.httpReq.post("care_service/oldmanInfo",null,{oldmanId:this.oldmanId},data=>{
      this.Loading = false;
      if(data.code === 0){
        this.olderInfo = data.data;
      }
    })
  }

  //
  goback(){
    window.history.back();
  }


}
