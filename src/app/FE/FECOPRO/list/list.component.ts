/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-05 13:53:01
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
import { ServeConfigService } from "../../../common/config/serve-config.service";
import { LocalStorage } from "../../../common/service/local.storage";
import { Utils } from "src/app/common/utils/utils";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  user;
  //列表是否是加载状态
  isTableLoading = false;
  dataArray = [];
  //
  feeCategory = [];
  //列表查询条件
  queryParams = {
    page: 1,
    size: 10,
    itemCode: "",
    itemName: "",
    expCategoryId: ""
  };
  resultData = {
    totalElements: 0
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private modalService: NzModalService,
    private httpReq: HttpReqService,
    private serveConfigService: ServeConfigService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
    }

    this.loadingFeeCategoryArray();
    this.loadingDataArray();
  }

  //对输入协议名称的验证
  inputNameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.length <= 0 || control.value.length > 30) {
      return { confirm: true, error: true };
    }
  };
  /**
   * 加载列表数据
   */
  loadingDataArray(reset: boolean = false) {
    this.isTableLoading = true;

    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }

    let that = this;
    let param = this.httpReq.post(
      "expItem/listPage",
      null,
      this.queryParams,
      data => {
        that.isTableLoading = false;
        if (data["code"] == 0) {
          sessionStorage.setItem(
            this.router.url,
            JSON.stringify(this.queryParams)
          );

          that.resultData = data["data"];
          that.queryParams.page++;
          that.dataArray = data["data"]["content"];
          if (that.dataArray.length > 0) {
            for (let index = 0; index < that.dataArray.length; index++) {
              const e = that.dataArray[index];
              e.chargeMode = e.chargeMode.split(",");
            }
          }
        }
      }
    );
  }

  /**
   * 删除模板确认对话框
   */
  confirmDelContract(contract, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let that = this;
    this.modalService.confirm({
      nzTitle: "请确认是否删除?",
      // nzContent:
      //   '<b style="color: red;">合同模板删除后无法恢复，请谨慎操作！</b>',
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        that.delTemplate(contract);
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }

  //删除协议模板
  delTemplate(contract) {
    this.isTableLoading = true;
    let params = { id: contract.id };
    let that = this;
    this.httpReq.post("expItem/delete", null, params, data => {
      that.isTableLoading = false;
      if (data["code"] == 0) {
        that.loadingDataArray(true);
      }
    });
  }
  turnToEdit(data) {
    console.log("tag", JSON.stringify(data));
    this.router.navigate(["edit", JSON.stringify(data)], {
      relativeTo: this.route
    });
  }

  /**
   * 加载消费类别列表数据
   */
  loadingFeeCategoryArray() {
    const queryParams = {
      name: ""
    };
    this.httpReq.post("expCategory/listAll", null, queryParams, data => {
      if (data["code"] == 0) {
        this.feeCategory = data["data"];
      }
    });
  }
}
