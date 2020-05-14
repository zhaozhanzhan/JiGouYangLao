import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "src/app/common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Session } from "src/app/common/service/Storage";
import { EntrustMedicineService } from "../entrust-medicine.service";
import * as _ from "underscore";
@Component({
  selector: "app-outType",
  templateUrl: "./outType.component.html",
  styleUrls: ["./outType.component.css"]
})
export class OutTypeComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    /**  请求参数
     * {"page":"页面",
     * "size":"每页数量",
     * "templateName": "模板名称",
     * "templateType": "模板类型"
     */
    page: 1,
    size: 10,
    key: "",
    outType:"",
    isOut:""
  };
  list = [];
  type1="";
  type2="";
  type3="";
  isTableLoading = false;

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      console.log(JSON.parse(sessionStorage.getItem(this.router.url)))
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      // console.log(this.reqObj)
      // this.page.index = this.reqObj.page + 1;
      // this.page.size = this.reqObj.size;
    }

    this.updateList();
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    // console.log(this.reqObj.page);
    // console.log(this.reqObj.size);
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    console.log(this.reqObj);
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    
    this.isTableLoading = true;
    this.httpReq.get(
      "clinicMedRecord/listOutTypeAmount",
      this.reqObj,
      data => {
        this.isTableLoading = false;
        if (data["status"] == 200) {
          this.list = data["data"]["list"]["content"];
          this.page.total = data["data"]["list"]["totalElements"];
          this.type1= data["data"]["type1"];
          this.type2= data["data"]["type2"];
          this.type3= data["data"]["type3"];
        }
      }
    );
  }


  // // 获得所有列表的信息
  // updateList1(reset: boolean = false): void {
  //   sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
  //   console.log("--------------");
  //   this.httpReq.get(
  //     "clinicMedRecord/listOutTypeAmount",
  //     this.reqObj,
  //     data => {
  //       if (data["status"] == 200) {
  //         console.log(data);
  //         this.dataSet = data["data"]
  //       }
  //     }
  //   );
  // }
}