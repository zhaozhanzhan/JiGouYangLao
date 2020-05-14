import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { Utils } from "../../common/utils/utils";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { ENgxPrintComponent } from "e-ngx-print";
@Component({
  selector: "app-rehabilitationFiles",
  templateUrl: "./rehabilitationFiles.component.html",
  styleUrls: ["./rehabilitationFiles.component.css"]
})
export class RehabilitationFilesComponent implements OnInit {
  @ViewChild("print") printComponent: ENgxPrintComponent;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    type: "",
    startTime: "",
    endTime: "",
    menuType: "1"
  }; //请求列表得参数
  list = []; //列表得数组
  isTableLoading = false; //列表加载状态
  selectedDate = []; //日期
  // printCSS = ["assets/css/common.css", "assets/css/first-care-print.css"];
  printCSS = `
  .textCenter{
    text-align: center
}
  `;
  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.reqObj.startTime) &&
        !Utils.isEmpty(this.reqObj.endTime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.startTime));
        this.selectedDate.push(new Date(this.reqObj.endTime));
      }
    }

    this.updateList();
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.get("/children/listRehabilitationFiles", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // 选择日期
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.reqObj.startTime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.reqObj.startTime = "";
    }
    if (dateArr[1]) {
      this.reqObj.endTime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.endTime = "";
    }
  }

  turnToCheck(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    if (data.type == "1") {
      this.router.navigate(
        [
          "../childRehabilitation/brainsDetails",
          {
            id: data.childrenId,
            isAssessment1: data.isAssessment1,
            check: "check",
            data: JSON.stringify(data)
          }
        ],
        {
          relativeTo: this.route
        }
      );
    } else {
      this.router.navigate(
        [
          "../childRehabilitation/limeDetails",
          {
            id: data.childrenId,
            isAssessment2: data.isAssessment2,
            check: "check",
            data: JSON.stringify(data)
          }
        ],
        {
          relativeTo: this.route
        }
      );
    }
  }

  // 打印
  isPrintNow = false;
  isShow = false;
  onPrint(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShow = true;
    this.page.size = 10000;
    this.page.index = 1;
    this.updateList();

    this.isPrintNow = true;

    this.printComponent.print();
  }

  // 取消打印
  printComplete() {
    this.page.size = 10;
    this.page.index = 1;
    this.updateList();
    this.isPrintNow = false;
    this.isShow = false;
  }
}
