import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";
import { LocalStorage } from "../../../../common/service/local.storage";
@Component({
  selector: "app-in-storehouse-list2",
  templateUrl: "./in-storehouse-list2.component.html",
  styleUrls: ["./in-storehouse-list2.component.css"]
})
export class InStorehouseList2Component implements OnInit {
  goodsList = [];
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    operator: "",
    supplier: "",
    medDrugName:"",
    btime: "",
    etime: "",
  };

  selectedDates = [];
  setionOfficeList = [];
  isTableLoading = false;
  constructor(
    private router: Router,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url + "2") !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url + "2"));
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDates.push(new Date(this.reqObj.btime));
        this.selectedDates.push(new Date(this.reqObj.etime));
      }
    }
   

     // 获得所有得科室
     this.httpReq.post("/section_office/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.setionOfficeList = data["data"];
      }
    });


    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url + "2", JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post("/in_med_drug/listPageMd", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200 && data["code"] == 0) {
        const result = data["data"];
        this.list = result.content;
        this.page.total = result.totalElements;
      }
    });
  }

  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.reqObj.btime = "";
    }
    if (dateArr[1]) {
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.btime = "";
    }
  }
}
