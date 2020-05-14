import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as _ from 'underscore';


@Component({
  selector: 'app-service-record',
  templateUrl: './service-record.component.html',
  styleUrls: ['./service-record.component.css']
})
export class ServiceRecordComponent implements OnInit {
  // 请求参数
  sendData = {
    /**
  {"page":"页码",
  "size":"每页数量",
  "":"老人姓名模糊检索",
  "":"床位名称模糊检索",
  "":"区域名称模糊检索",
  "eName":"员工姓名模糊检索",
  "type":"服务类型",
  "isNow":"是否当前时间内完成",
  "btime":"开始时间",
  "etime":"结束时间"}
  */
    oldName: "", // 老人姓名模糊检索
    bedName: "", // 床位名称模糊检索
    area: "", // 区域名称模糊检索
    eName: "", // 员工姓名模糊检索
    type: "1", // 服务类型
    isNow: "true", // 是否当前时间内完成
    btime: "", // 开始时间
    etime: "", // 结束时间
    selDate: [], // 选择日期
    page: 0, //页数
    size: 50 //每页数量
  };

  Loading = false; // 列表Loading
  listOfData = []; // 服务项目列表
  totalElements; // 总条数
  checkProModelIsVisible = false; // 查看详情弹框
  checkLoading = false;
  public project = {  // 查看项目
    needGoods: false,
    itemName: '',
    itemStandard: '',
    type: '',
    registerContent: {
      diy: []
    }
  }; 
  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url)) {
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      this.sendData.page = 0;
    }
    
    //
    this.getList(true);
  }

  // 获取服务项目列表
  getList(renewPage:boolean = false) {
    if(renewPage) this.sendData.page = 0;
    this.Loading = true;
    this.httpReq.post("care/listCareRecord", null, this.sendData, data => {
      sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
      this.Loading = false;
      if (data.code == 0) {
        this.listOfData = data.data.content;
        this.listOfData.forEach((item:object)=>{
          if(item["picEl"]){
            item["picEl"] = JSON.parse(item["picEl"]);
          }
          if(item["registerContent"]){
            item["registerContent"] = JSON.parse(item["registerContent"]);
          }
        })
        this.totalElements = data.data.totalElements;
      }
    });
  }

  // 页码变更
  PageIndexChange(PageIndexNum) {
    this.sendData.page = PageIndexNum - 1;
    this.getList();
  }

  // 每页条数变更
  PageSizeChange(PageSize) {
    this.sendData.size = PageSize;
    this.getList();
  }

  // time changed
  timeChange(time:[Date,Date]){
    if(!time.length){
      this.sendData.btime = '';
      this.sendData.etime = '';
      return;
    }
    this.sendData.selDate = time;
    let star = time[0],
        end = time[1];
    if(star) this.sendData.btime = this.transformDate(star);
    if(end) this.sendData.etime = this.transformDate(end);
    console.log(this.sendData);
  }

  // transform Date to String
  transformDate(date:Date){
    if(!date) return '';
    let Y = date.getFullYear();
    let M = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    let D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    let H = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    let S = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${Y}-${M}-${D} ${H}:${S}:00`;
  }

  // 查看
  detail(data){
    this.project = data;
    let fuckdiy = data.registerContent.diy;
    if(fuckdiy instanceof Array && fuckdiy.length){
      fuckdiy.forEach((item)=>{
        if(item['classify'] == '多选' && item['value'] instanceof Array && item['value'].length){
          item['value'].forEach(element => {
            if(element['ischecked']){
              element['checked'] = true;
            }
          });
        }
      })
    }
    // _.extend(this.project, fuckdiy);
    console.log(this.project);
    this.checkProModelIsVisible = true;
    // this.checkLoading = true;
    // this.httpReq.post("service_item/listOne", null, {id:id}, data => {
    //   this.checkLoading = false;
    //   if (data.code == 0) {
    //     let info =  data["data"];
    //     if(info["classify"]){
    //       this.getSysProject(info["classify"]);
    //     }
    //     info["diy"] = JSON.parse(info["diy"]);
    //     info["level"] = JSON.parse(info["level"]);
    //     _.extend(this.formData, info);
    //     if(info["object"] === "人"){ this.showCareLevel = true; };
    //   }
    // });
  }
}
