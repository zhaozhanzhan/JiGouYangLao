import { Component, OnInit } from "@angular/core";
import { GetRelativeInfoService } from "../get-relative-info.service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";
import { ServeConfigService } from "../../../common/config/serve-config.service";
@Component({
  selector: "app-in-med-list",
  templateUrl: "./in-med-list.component.html",
  styleUrls: ["./in-med-list.component.css"]
})
export class InMedListComponent implements OnInit {
  /**
  {"page": "页码",
  "size": "每页数量",
  "search": "药品名称或者拼音首字母",
  "medRoomId":"药房id"}
  */
  // 请求参数
  sendData = {
    page: 0,
    size: 100,
    search: "",
    medRoomId: "",
    btime: "",
    etime: ""
  };

  Loading = false; // Loading
  listOfData = []; // 药品列表
  totalElements; // 总条数
  medRoomList; // 药房列表
  timer;
  timerTime = 0;
  selDate; // 查询时间

  constructor(
    public getInfo: GetRelativeInfoService,
    private message: NzMessageService,
    private router: Router,
    public httpReq: HttpReqService,
    private http: HttpClient,
    private serveConfigService: ServeConfigService
  ) {}
  ngOnInit() {
    if (sessionStorage.getItem(this.router.url)) {
      this.sendData = JSON.parse(sessionStorage.getItem(this.router.url));
      if (this.sendData.etime && this.sendData.btime)
        this.selDate = [
          new Date(this.sendData.etime),
          new Date(this.sendData.btime)
        ];
      this.sendData.page = 0;
    }
    this.getInfo.getMedRoomList(data => {
      this.medRoomList =
        data.data instanceof Array
          ? data.data
          : [{ medRoomName: "暂无药房", id: "" }];
      if (!this.sendData.medRoomId)
        this.sendData.medRoomId = this.medRoomList[0].id;
    });
    this.list();
  }

  // 防止请求异步导致列表请求参数不完整
  list() {
    let that = this;
    clearTimeout(that.timer);
    if (that.timerTime++ > 9) {
      that.message.error("查询药房列表超时！");
      return;
    }
    if (!this.sendData.medRoomId) {
      that.timer = setTimeout(function() {
        return that.list();
      }, 200);
      return;
    }
    that.getList();
  }

  // 获取药房明细列表
  getList(reset: boolean = false): void {
    if (reset) {
      this.sendData.page = 1;
    }
    this.sendData.page = this.sendData.page - 1;
    this.sendData.size = this.sendData.size;
    if (this.sendData.page < 0) {
      this.sendData.page = 0;
    }
    this.Loading = true;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.sendData));
    this.httpReq.post(
      "medRoomInventory/listInventory",
      null,
      this.sendData,
      data => {
        this.Loading = false;
        if (data.code == 0) {
          this.listOfData = data.data.list;
          this.totalElements = data.data.totalElements;
        }
      }
    );
  }

  // 页码变更
  PageIndexChange(PageIndexNum) {
    this.sendData.page = PageIndexNum;
    this.getList();
  }

  // 每页条数变更
  PageSizeChange(PageSize) {
    this.sendData.size = PageSize;
    this.getList();
  }

  // 选择日期格式化
  dateChange(data) {
    if (!data.length) {
      this.sendData.btime = "";
      this.sendData.etime = "";
      return;
    }
    this.sendData.btime =
      data[0].getFullYear() +
      "-" +
      (data[0].getMonth() + 1 < 10
        ? "0" + (data[0].getMonth() + 1)
        : data[0].getMonth() + 1) +
      "-" +
      (data[0].getDate() < 10 ? "0" + data[0].getDate() : data[0].getDate());
    this.sendData.etime =
      data[1].getFullYear() +
      "-" +
      (data[1].getMonth() + 1 < 10
        ? "0" + (data[1].getMonth() + 1)
        : data[1].getMonth() + 1) +
      "-" +
      (data[1].getDate() < 10 ? "0" + data[1].getDate() : data[1].getDate());
  }
}
