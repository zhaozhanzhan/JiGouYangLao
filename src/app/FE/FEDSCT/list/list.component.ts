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

@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  queryParams = {
    page: 0, //"页数",
    size: 10, //"数量",
    voucherCode: "", //"抵扣代码",
    voucherName: "", //"抵扣名称",
    useConditions: "", //"使用条件",
    deductionType: "", //"抵扣类型",
    deductibleAmount: "", //"抵扣金额",
    expCategoryId: "", //"抵扣消费类别",
    expItemId: "", //"抵扣消费项目",
    issuingState: "" //"发行状态"
  };
  //table加载状态
  isTableLoading = false; //表格加载状态
  dataArray = []; //数据
  resultData = {
    //条数
    totalElements: 0
  };
  expCategoryList = []; //类别
  expItemList = []; //项目
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
    }

    this.loadingDataArray();
    this.getExpCategory();
  }
  // 通过消费类别ID获得消费项目
  changeExpItem() {
    this.httpReq.post(
      "expItem/listByExpCategoryId",
      null,
      { id: this.queryParams.expCategoryId },
      data => {
        if (data["code"] == 0) {
          this.expItemList = data["data"];
        }
      }
    );
  }
  // 获得所有的消费类别
  getExpCategory() {
    this.httpReq.post("expCategory/listAll", null, null, data => {
      if (data["code"] == 0) {
        this.expCategoryList = data["data"];
      }
    });
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
    this.httpReq.post("Rebate/listPage", null, this.queryParams, data => {
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

  //跳转编辑页面
  edit(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["add", { id: data.id }], {
      relativeTo: this.route
    });
  }

  //停用
  delete(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let that = this;
    this.modalService.confirm({
      nzTitle: "请确认是否停用?",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        let param = {
          id: id
        };
        that.isTableLoading = true;
        that.httpReq.post("Rebate/stop", null, param, data => {
          that.isTableLoading = false;
          if (data["status"] == 200) {
            that.loadingDataArray();
          }
        });
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }

  //启用
  start(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let that = this;
    this.modalService.confirm({
      nzTitle: "请确认是否启用?",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        let param = {
          id: id
        };
        that.isTableLoading = true;
        that.httpReq.post("Rebate/start", null, param, data => {
          that.isTableLoading = false;
          if (data["status"] == 200) {
            that.loadingDataArray();
          }
        });
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }
}
