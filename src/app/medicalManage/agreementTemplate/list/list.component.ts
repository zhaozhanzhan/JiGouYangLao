/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 15:23:06
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
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  user;
  //添加输入的协议名称
  inputTemplateName = "";
  selectedTypeValue = "";
  //添加协议名称的表单
  validateForm: FormGroup;
  //添加协议的对话框显示控制
  isShowAddDialog = false;
  //保存时按钮等待状态；
  isSaveLoading = false;
  //列表是否是加载状态
  isTableLoading = false;

  //当前选择编辑的模板
  selectedTemplate = null;

  dataArray = [];
  //模板类型列表
  templateTypeArray = [];
  //列表查询条件
  queryParams = {
    page: 1,
    size: 10,
    name: "",
    startStop: 0
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
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, this.inputNameValidator]],
      type: [null, [Validators.required]]
    });

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
    let params =
    {
      comment: "",
      formConfiguration: "",
      id: "",
      name: this.inputTemplateName,
      typeId: this.selectedTypeValue
    }
    let that = this;

    this.httpReq.post("doctorPatientCommunication/saveTemplate", null, params, data => {
      that.isSaveLoading = false;
      if (data["code"] == 0) {
        that.isShowAddDialog = false;
        that.loadingDataArray(true);
      }
    });
  }
  //修改协议模板
  modifyTemplate() {
    if (this.selectedTemplate == null) {
      this.message.error("数据错误！");
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
    this.isSaveLoading = true;
    this.selectedTemplate.name = this.inputTemplateName;
    this.selectedTemplate.typeId = this.selectedTypeValue
    let that = this;

    this.httpReq.post(
      "doctorPatientCommunication/saveTemplate",
      null,
      this.selectedTemplate,
      data => {
        that.isSaveLoading = false;
        if (data["code"] == 0) {
          that.isShowAddDialog = false;
          that.loadingDataArray(true);
        }
      }
    );
  }
  /**
   * 保存合同模板按钮点击事件
   */
  onSaveTemplate() {
    if (this.selectedTemplate == null) {
      this.addTemplate();
    } else {
      this.modifyTemplate();
    }
  }
  showAddDialog() {

    this.isShowAddDialog = true;
    this.inputTemplateName = "";
    this.selectedTypeValue = "";

    this.selectedTemplate = null;

    if (this.templateTypeArray.length == 0) {
      this.getTemplateTypeList();
    }
  }
  showModifyDialog(template) {
    this.isShowAddDialog = true;
    this.inputTemplateName = template.name;
    this.selectedTypeValue = template.typeId;
    this.selectedTemplate = template;

    if (this.templateTypeArray.length == 0) {
      this.getTemplateTypeList();
    }
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
    let param = this.httpReq.get(
      "doctorPatientCommunication/listTemplate",
      this.queryParams,
      data => {
        that.isTableLoading = false;
        if (data["status"] == 200) {
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
  confirmDelTemplate(contract) {

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
    this.httpReq.post("doctorPatientCommunication/deleteTemplate", null, params, data => {
      that.isTableLoading = false;
      if (data["code"] == 0) {
        that.loadingDataArray(true);
      }
    });
  }

  //跳转编辑合同模板
  editTemplate(template) {
    this.router.navigate(["info", JSON.stringify(template)], {
      relativeTo: this.route
    });
  }
  /**
   * 加载模板类型列表数据
   */
  getTemplateTypeList() {
    this.isTableLoading = true;

    let queryParams = {
      page: 0,
      size: 100,
      name: ""
    }

    let that = this;
    this.httpReq.get(
      "doctorPatientCommunication/listTemplateType",
      queryParams,
      data => {
        that.isTableLoading = false;
        if (data["status"] == 200) {
          that.templateTypeArray = data["data"]["content"];
        }
      }
    );
  }
}
