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
  oldManList = []; //老人列表数据

  // 老人列表参数
  oldManObj = {
    page: 0, //,"页数",
    size: 10, //"数量",
    name: "", //"老人姓名",
    cardno: "" //"老人身份证"}
  };
  totalElements = 0; //总条数
  isOldTableLoading = false; //加载状态
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
      this.oldManObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.getOldManList();
  }

  //  获得所有的老人列表
  getOldManList(reset: boolean = false) {
    if (reset) {
      this.oldManObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldManObj.page = this.oldManObj.page - 1;
      if (this.oldManObj.page < 0) {
        this.oldManObj.page = 0;
      }
    }
    sessionStorage.setItem(this.router.url, JSON.stringify(this.oldManObj));
    this.isOldTableLoading = true;
    this.httpReq.post("consumption/listOldMan", null, this.oldManObj, data => {
      this.isOldTableLoading = false;
      if (data["code"] == 0) {
        const result = data["data"]["result"];
        this.oldManList = result;
        this.totalElements = data["data"]["totalElements"];
      }
    });
  }

  //跳转消费详情
  info(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["add", { id: id }], {
      relativeTo: this.route
    });
  }
}
