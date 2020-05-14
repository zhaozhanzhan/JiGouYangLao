import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-releaseRecord",
  templateUrl: "./releaseRecord.component.html",
  styleUrls: ["./releaseRecord.component.css"]
})
export class ReleaseRecordComponent implements OnInit {
  storehouseClassificationList;
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    spid: "",
    oldmanName: "",
    page: 1,
    size: 10,
    btime: "",
    etime: ""
  };
  selectedDates = [];
  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDates.push(new Date(this.reqObj.btime));
        this.selectedDates.push(new Date(this.reqObj.etime));
      }
    }

    this.httpReq.post("/schedulingProgram/list1", null, {}, data => {
      if (data["status"] == 200) {
        this.storehouseClassificationList = data["data"];
      }
    });

    this.updateList();
  }

  turnToAdd() {
    this.router.navigate(["addEdit", { state: "add" }], {
      relativeTo: this.route
    });
  }

  turnToEdit(data) {
    this.router.navigate(["addEdit", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }
  lodManName = "";
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;

    this.httpReq.post("/outSendList/listPc", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200 && data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];

        this.list.forEach(e => {
          const oldmanList = JSON.parse(e.oldmans);
          this.lodManName = "";
          oldmanList.forEach(oldE => {
            this.lodManName += oldE.name + ",";
          });
          e.oldmans = this.lodManName;
        });
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
      this.reqObj.etime = "";
    }
  }
}
