import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-refundMedicineDetail",
  templateUrl: "./refundMedicineDetail.component.html",
  styleUrls: ["./refundMedicineDetail.component.css"]
})

export class RefundMedicineDetailComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    sectionOfficeBackId:"",
    backMedDrug:"",
    operator: "",
    btime: "",
    etime: "",
  };

  selectedDates = [];
  isTableLoading = false;
  setionOfficeList=[];//科室列表
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url + "1") !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url + "1"));
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


// 获得列表
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url + "1", JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post("/back_med_drug/listPage", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  //选择时间
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