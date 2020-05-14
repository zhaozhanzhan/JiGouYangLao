import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { HttpReqService } from '../../../common/service/HttpUtils.Service';
import { JsUtilsService } from '../../../common/service/JsUtils.Service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  olderInfo; // 老人信息
  line = []; // 打印行
  // 打印样式
  printCSS = `
              .page {
                  width: 21cm;
                  min-height: 29.7cm;
                  padding: 2cm;
                  padding-top: 50px;
                  margin: 20px auto;
                  background: white;
                  page-break-before: always;
              }

              @page {
                  size: A4;
                  margin: 0;
              }

              table {
                  border-collapse:collapse;
              }
              table tr td{
                padding: 5px;
              }

  `;
  systemInfo; //系统信息

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
    // console.log( this.route.snapshot.paramMap.get('msg'));
    this.olderInfo = JSON.parse(this.route.snapshot.paramMap.get('msg'));
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    this.getList();
  }

  getList(){
    this.httpReq.post('dictMgt/listDataByType', null, {dictType: "med_content"}, res=>{
      if(res.code === 0){
        if(res.data instanceof Array && res.data.length){
          this.line = res.data;
          if(this.line.length < 28) this.line.length = 28;
        }
      }
    })
  }

  back(){
    window.history.back();
  }

}
