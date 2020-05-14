/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-05 15:30:45
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
  //添加协议名称的表单
  validateForm: FormGroup;
  //添加协议的对话框显示控制
  isShowAddDialog = false;
  //保存时按钮等待状态；
  isSaveLoading = false;
  //列表是否是加载状态
  isTableLoading = false;

  //当前选择编辑的协议
  selectedType = null;

  dataArray = [];

  //列表查询条件
  queryParams = {
    page: 1,
    size: 10,
    name: "",
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
  ) {

  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, this.inputNameValidator]],
      sort: [0, [Validators.required]],
      comment: [""]
    });

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
    }
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
  //保存协议模板
  addTemplate(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
    this.isSaveLoading = true;
    this.user = this.localStorage.getUser();

    const params = this.validateForm.value;
    params.accountId = this.user.id;

    this.httpReq.post("expCategory/saveOrUpdate", null, params, data => {
      this.isSaveLoading = false;
      if (data["code"] == 0) {
        sessionStorage.setItem(this.router.url, JSON.stringify(this.queryParams));
        this.isShowAddDialog = false;
        this.loadingDataArray(true);
      }
    });
  }
  //修改协议模板
  modifyTemplate() {
    if (this.selectedType == null) {
      this.message.error("数据错误！");
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }

    const params = this.validateForm.value;
    this.user = this.localStorage.getUser();
    params.accountId = this.user.id;
    params.id = this.selectedType.id;

    this.isSaveLoading = true;
    this.httpReq.post(
      "expCategory/saveOrUpdate",
      null,
      params,
      data => {
        this.isSaveLoading = false;
        if (data["code"] == 0) {
          this.isShowAddDialog = false;
          this.loadingDataArray(true);
        }
      }
    );
  }
  /**
   * 保存类型按钮点击事件
   */
  onSaveTemplate() {
    if (this.selectedType == null) {
      this.addTemplate();
    } else {
      this.modifyTemplate();
    }
  }
  showAddDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowAddDialog = true;
    this.validateForm.patchValue({
      id: "",
      accountId: "",
      name: "",
      sort: 0,
      comment: ""
    });
    this.selectedType = null;
  }
  showModifyDialog(type, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowAddDialog = true;
    this.validateForm.patchValue({
      id: "",
      accountId: "",
      name: type.name,
      sort: type.sort,
      comment: type.comment
    });
    this.selectedType = type;
  }

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
    this.httpReq.post(
      "expCategory/listPage",
      null,
      this.queryParams,
      data => {
        that.isTableLoading = false;
        if (data["code"] == 0) {
          that.resultData = data["data"];
          that.queryParams.page++;
          that.dataArray = data["data"]["content"];
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
      nzOnCancel: () => { }
    });
  }

  //删除协议模板
  delTemplate(contract) {
    this.isTableLoading = true;
    let params = { id: contract.id };
    let that = this;
    this.httpReq.post("expCategory/delete", null, params, data => {
      that.isTableLoading = false;
      if (data["code"] == 0) {
        that.loadingDataArray(true);
      }
    });
  }

}
