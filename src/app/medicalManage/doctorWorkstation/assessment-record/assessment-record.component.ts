import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: 'app-assessment-record',
  templateUrl: './assessment-record.component.html',
  styleUrls: ['./assessment-record.component.css']
})
export class AssessmentRecordComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: ""
  };

  isTableLoading = true;
  user;
  accountId;

  // 弹框相关
  timer;
  isShowOldDialog = false; //选择老人是弹出框显示
  isOldTableLoading = false; // loading
  oldDataArray = [
    // {
    //   id: 123213123,
    //   name: '王二狗',
    //   sex: '男',
    //   age: '88',
    //   birthYearMonth: '1937-07-01',
    //   phone: '15945681574',
    //   createDate: '2019-08-01',
    // }
  ]; //老人列表的数组


  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage //存储
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    // this.baseUrl = JSON.parse(localStorage.getItem("serveConfig")).baseUrl;
    this.accountId = this.user.data.id;

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
    this.httpReq.get("conditionAssessment/listAll", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // model
  showOldDialog() {
    this.isShowOldDialog = true;
    this.loadingOldList();
  }

  //加载老年人列表
  loadingOldList(name:string = '') {
    this.isOldTableLoading = true;
    this.httpReq.get("conditionAssessment/listAllOldman", {key: name}, data => {
      this.isOldTableLoading = false;
      if(data.code === 0){
        this.oldDataArray = data.data || [];
      }
    });
  }

  // input检索
  serachOlder(name:string = ''){
    clearTimeout(this.timer);
    this.timer = setTimeout(_=>{
      this.loadingOldList(name);
    },500);
  }

  // 入院评估
  gogogo(older,num, type = 'add'){
    if(older.id){
      if(num == 1) num = 'inhostpitalAssess';
      if(num == 2) num = 'operationAssess';
      if(type == 'add') this.router.navigate([num, {older: JSON.stringify(older), type: 'add'}], {relativeTo: this.route.parent});
      else if(type == 'edit') this.router.navigate([num, {older: JSON.stringify(older), type: 'edit'}], {relativeTo: this.route.parent});
    }else{
      alert('当前老人信息有误，请稍后再试！');
    }
  }

}
