import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
import { Utils } from "../../../common/utils/utils";

@Component({
  selector: "app-checkOut",
  templateUrl: "./checkOut.component.html",
  styleUrls: ["./checkOut.component.css"]
})
export class CheckOutComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    oldmanName: "",
    outSendId: "",
    page: 1,
    size: 10,
    btime: "",
    etime: ""
  };
  storehouseClassificationList = [];
  selectedDates = [];
  list = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    this.reqObj.outSendId = this.route.snapshot.paramMap.get("id");
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
    this.router.navigate(["../addEdit", { state: "add" }], {
      relativeTo: this.route
    });
  }

  turnToEdit(data) {
    this.router.navigate(["../check", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }
  back() {
    history.back();
  }
  lodManName = "";
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.httpReq.post("/outSend/sendListPcDetail", null, this.reqObj, data => {
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
