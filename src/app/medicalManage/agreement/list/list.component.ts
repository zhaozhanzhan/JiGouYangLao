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
    page: 0,
    size: 10,
    hospitalNo: "",
    nameOrCardNo: ""
  };
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };

  constructor(
    private jsUtil: JsUtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
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
    let param = this.httpReq.get(
      "doctorPatientCommunication/listDoctorPatientCommunication",
      this.queryParams,
      data => {
        this.queryParams.page++;
        that.isTableLoading = false;
        if (data["status"] == 200) {
          this.dataArray = data["data"]["content"]; // 数据列表
          this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }

  //跳转老年人合同详情页面
  showInfo(contract, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["info", JSON.stringify(contract)], {
      relativeTo: this.route
    });
  }

  //跳转老年人合同添加页面
  addInfo(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["add"], {
      relativeTo: this.route
    });
  }

  //删除合同
  delContract(contract, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let that = this;
    this.modalService.confirm({
      nzTitle: "请确认是否删除?",
      // nzContent: '<b style="color: red;">合同删除后无法恢复，请谨慎操作！</b>',
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        let param = {
          id: contract.id
        };
        that.isTableLoading = true;
        that.httpReq.post("doctorPatientCommunication/deleteDoctorPatientCommunication", null, param, data => {
          that.isTableLoading = false;
          if (data["status"] == 200) {
            that.loadingDataArray();
          }
        });
      },
      nzCancelText: "取消",
      nzOnCancel: () => { }
    });
  }

}
