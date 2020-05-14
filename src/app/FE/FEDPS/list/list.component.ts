import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  validateForm: FormGroup;
  // {"page":"页数","size":"数量","name":"老人姓名","cardno":"老人身份证"}
  queryParams = {
    page: 0,
    size: 20,
    name: '',
    cardno: '',
  };
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.getList();
  }

  getList(reset: boolean = false) {
    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }
    sessionStorage.setItem(this.router.url, JSON.stringify(this.queryParams));
    this.isTableLoading = true;
    this.httpReq.post('consumerRegistration/listPage',null,this.queryParams,res => {
      this.isTableLoading = false;
      if(res.code === 0){
        if(res.data.hasOwnProperty('result') && res.data.result instanceof Array && res.data.result.length){
          this.dataArray = res.data.result;
          this.resultData.totalElements = res.data.TotalElements;
        }
      }
    })
  }

  goto(routeName:string,id){
    if(id) this.router.navigate([routeName, {id: id}],{relativeTo: this.route.parent});
     else console.error("can't find id in params!");
  }
  
  payMode(type: string): string{
    if(type == '1') return '支付宝';
    if(type == '2') return '微信';
    if(type == '3') return '现金';
    if(type == '4') return '银行卡';
    return '';
  }

}
