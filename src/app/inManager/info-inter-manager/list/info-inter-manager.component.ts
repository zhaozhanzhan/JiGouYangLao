import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { Utils } from "../../../common/utils/utils";

@Component({
  selector: "app-info-inter",
  templateUrl: "./info-inter-manager.component.html",
  styleUrls: ["./info-inter-manager.component.css"]
})
export class InfoInterManagerComponent implements OnInit {
  queryParams = {
    page: 1,
    size: 10,
    name: "",
    cardno: "",
    btime: "",
    etime: "",
    date: []
  };

  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.queryParams.btime) &&
        !Utils.isEmpty(this.queryParams.etime)
      ) {
        this.queryParams.date.push(new Date(this.queryParams.btime));
        this.queryParams.date.push(new Date(this.queryParams.etime));
      }
    }

    this.updateList();
  }

  turnToAdd(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save"], { relativeTo: this.route });
  }

  turnToEdit(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save", { id: id }], { relativeTo: this.route });
  }

  turnToCheck(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", id], { relativeTo: this.route });
  }

  showDeleteConfirm(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.globalService.delModal(() => {
      this.deleteData(id);
    });
  }

  updateList(reset: boolean = false): void {
    let that = this;
    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }

    that.isTableLoading = true;
    this.httpReq.post("interview/pagelist", null, this.queryParams, data => {
      that.queryParams.page++;
      sessionStorage.setItem(that.router.url, JSON.stringify(that.queryParams));
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.dataArray = data["data"]["content"]; // 数据列表
        that.resultData.totalElements = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  /**
   * 日期插件时间发生变化的回调
   * @param dateArr
   */
  public selDate(dateArr: Array<Date>) {
    if (dateArr[0]) {
      this.queryParams.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.queryParams.btime = "";
    }
    if (dateArr[1]) {
      this.queryParams.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.queryParams.etime = "";
    }
  }

  deleteData(id) {
    const reqObj: any = {};
    reqObj.id = id;

    let that = this;
    that.isTableLoading = true;
    this.httpReq.post("interview/del", null, reqObj, data => {
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.message.success("删除成功！");
        that.updateList(); // 调用查询列表方法更新列表
      }
    });
  }
}
