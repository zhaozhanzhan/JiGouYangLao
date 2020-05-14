/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-23 16:19:16
 * @Description:
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  queryParams = {
    page: 0, //"页数",
    size: 10, //"数量",
    name: "", //"老人姓名",
    cardno: "", //"老人身份证",
    itemCode: "", //"项目编号",
    itemName: "", //"项目名字",
    bedNo: "", //"床位号",
    btime: "", //"开始时间",
    etime: "", //"结束时间",
    expCategoryName: "", //"消费类别",
    chargeMode: "", //"收费方式",
    feeMode: "", //"计费方式",
    settlementStatus: "" //"结算状态"
  };
  //table加载状态
  isTableLoading = false; //表格加载状态
  dataArray = []; //数据
  resultData = {
    //条数
    totalElements: 0
  };
  date;
  constructor(
    private jsUtil: JsUtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.queryParams.btime) &&
        !Utils.isEmpty(this.queryParams.etime)
      ) {
        this.date.push(new Date(this.queryParams.btime));
        this.date.push(new Date(this.queryParams.etime));
      }
    }

    this.loadingDataArray();
  }

  turnToEdit(inApply) {
    this.router.navigate(["info", JSON.stringify(inApply)], {
      relativeTo: this.route
    });
  }

  loadingDataArray(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }
    sessionStorage.setItem(this.router.url, JSON.stringify(this.queryParams));
    that.isTableLoading = true;
    this.httpReq.post("consumption/listPage", null, this.queryParams, data => {
      this.queryParams.page++;
      that.isTableLoading = false;
      if (data["status"] == 200) {
        this.dataArray = data["data"]["content"]; // 数据列表
        this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  //跳转查看页面
  showInfo(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["info", { id: id }], {
      relativeTo: this.route
    });
  }

  //跳转添加页面
  addInfo(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["add"], {
      relativeTo: this.route
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
}
