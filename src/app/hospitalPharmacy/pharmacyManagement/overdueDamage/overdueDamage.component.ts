import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService, NzTreeNode } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-overdueDamage",
  templateUrl: "./overdueDamage.component.html",
  styleUrls: ["./overdueDamage.component.css"]
})
export class OverdueDamageComponent implements OnInit {
  selectedDates;
  list = [];

  setionOfficeList = [];
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    sectionOfficeId: "",
    btime: "",
    etime:"",
    page: 1,
    size: 10
  };

  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService,
  ) {}

  ngOnInit() {

    let that = this;
    
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDates.push(new Date(this.reqObj.btime));
        this.selectedDates.push(new Date(this.reqObj.etime));
      }
    }

    

    this.updateList();

     // 获得所有得科室
     this.httpReq.post("/section_office/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.setionOfficeList = data["data"];
      }
    });
  }

  // 跳转添加
  turnToAdd() {
    this.router.navigate(["addEdit"], {
      relativeTo: this.route
    });
  }

// 审批
  turnToApprove(id) {
    this.router.navigate(["approve",{id:id}], {
      relativeTo: this.route
    });
  }

  // 查看
  turnToCheck(id) {
    this.router.navigate(["check",{id:id}], {
      relativeTo: this.route
    });
  }

  turnToApproveCheck(data){
    this.router.navigate(["approveCheck",{data:JSON.stringify(data)}], {
      relativeTo: this.route
    });
  }
  // 获得列表
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;

    this.httpReq.post("/md_overdue_damage/listPage", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }
  // 选择时间
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
