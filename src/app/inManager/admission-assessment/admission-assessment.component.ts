import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { Utils } from "../../common/utils/utils";
@Component({
  selector: "app-admission-assessment",
  templateUrl: "./admission-assessment.component.html",
  styleUrls: ["./admission-assessment.component.css"]
})
export class AdmissionassessmentComponent implements OnInit {
  list;
  auditStatus;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    appayType: "1",
    btime: "",
    etime: ""
  };
  isTableLoading = false;
  selectedDate = [];
  // 保存起来查询条件
  // queryParams={
  //   name:this.reqObj.name,
  //   appayType:this.reqObj.appayType

  // }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.btime));
        this.selectedDate.push(new Date(this.reqObj.etime));
      }
    }
    this.updateList();
  }

  turnToAdd(Crouter, id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate([Crouter, id], { relativeTo: this.route });
  }
  gradeChange() {}
  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.btime = "";
      this.reqObj.etime = "";
    }
  }
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    const that = this;
    this.isTableLoading = true;

    this.httpReq.post("oldman/asslist", null, this.reqObj, data => {
      sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.page.total = data["data"]["totalElements"];
        that.list = data["data"]["content"];
        for (const i in that.list) {
          that.list[i].memo = JSON.parse(that.list[i].memo);
        }
      }
    });

    // this.httpService.doPostHttp(
    //   'oldman/asslist',
    //   this.reqObj,
    //   function(successful, result, res) {
    //     that.isTableLoading=false;
    //     that.page.total = result.totalElements;
    //     that.list = result.content;
    //     for (const i in that.list) {
    //       that.list[i].memo=JSON.parse(that.list[i].memo);

    //     }
    //   },
    //   function(successful, msg, err) {
    //     const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
    //     that.toastService.toast(toastCfg);
    //   }
    // );
  }
}
