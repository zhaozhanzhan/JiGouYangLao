import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../../common/service/GlobalService";
import { Utils } from "../../../../common/utils/utils";

@Component({
  selector: "app-info-interview",
  templateUrl: "./info-interview-manager.component.html",
  styleUrls: ["./info-interview-manager.component.css"]
})
export class InfoInterviewManagerComponent implements OnInit {
  queryParams = {
    page: 1,
    size: 10,
    btime: "",
    etime: "",
    date: []
  };
  isVisible = false;
  //table加载状态
  isTableLoading = false;
  resultData = {
    totalElements: 0
  };
  nursingStatisticsList;
  nursingDataList;
  data;
  employeesGroup;
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
    this.nursingDataList = {};
    this.nursingStatisticsList = [];
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

  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  // 获得列表
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
    // if (this.queryParams.btime == '' || this.queryParams.btime == '') {
    // 	this.createMessage('error', '请选择时间');
    // }

    let params = {
      page: this.queryParams.page,
      size: this.queryParams.size,
      btime: this.queryParams.btime,
      etime: this.queryParams.etime
    };
    this.httpReq.post("/schedulingProgram/statistics", null, params, data => {
      that.queryParams.page++;
      sessionStorage.setItem(that.router.url, JSON.stringify(that.queryParams));
      that.isTableLoading = false;
      if (data["status"] == 200) {
        let result = JSON.parse(data["data"]);
        that.nursingStatisticsList = result["memo"]; // 数据列表
        that.resultData.totalElements = result["totalElements"]; // 总条数
      }
    });
  }

  showModalNumber = "";
  // 显示弹窗框
  showModal(nursingStatistics) {
    this.showModalNumber = "1";
    this.isVisible = true;
    this.nursingDataList = nursingStatistics;
    console.log(
      "nursingDataList" +
        JSON.stringify(this.nursingDataList) +
        this.nursingDataList
    );
  }

  showSingleDetail(name, data) {
    console.log("data" + JSON.stringify(this.data));
    this.showModalNumber = "2";
    this.isVisible = true;
    this.employeesGroup = name;
    this.data = data;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
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
}
