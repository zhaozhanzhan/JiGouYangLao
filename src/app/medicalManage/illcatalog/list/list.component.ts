import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { JsUtilsService } from '../../../common/service/JsUtils.Service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  // 请求数据
  reqObj = {
    key: '',
    cardNo: '',
  }

  // 返回列表
  list = [];

  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService,
    private settingService: SettingsService,
    public http: _HttpClient
  ) { }

  ngOnInit() {
    this.search();
  }

  search(){
    this.httpReq.get('sickWard/listByNameAndIdCard', this.reqObj, res=>{
      // console.log(res);
      if(res.code === 0){
        if(res.data instanceof Array && res.data.length){
          this.list = res.data;
        }
      }
    })
  }

  go(url,info){
    let msg = {
      name: info.basicInfo.name || '',
      sex: info.basicInfo.sex == '0' ? '男' : '女',
      age: info.basicInfo.age || '',
      admissionNo: info.admissionNo || '',
      inHospitalInfoId: info.id
    }
    if(!msg.inHospitalInfoId) return;
    this.router.navigate([url, {msg: JSON.stringify(msg)}],{relativeTo: this.route.parent});
  }

}
