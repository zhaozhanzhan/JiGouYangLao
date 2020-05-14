/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-27 10:52:38
 * @Description:
 */
import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
  //合同内容
  templateContent = [];

  //保存合同按钮的状态
  saveBtnLoading = false;
  searchOldName = "";
  saveContractParams = {
    formConfiguration: "",
    id: "",
    oldmanId: "",
    templateId: "",
    templateName: ""
  }

  //是否是编辑模式
  isModifyMode = false;
  oldQueryParams = {
    key: ""
  };
  //老年人列表table加载状态
  isOldTableLoading = false;
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };

  //合同模板列表table加载状态
  isContractTableLoading = false;
  contractDataArray = [];
  //列表查询条件
  contractqueryParams = {
    page: 1,
    size: 10,
    name: "",
    startOrStop: 0
  };
  contractResultData = {
    totalElements: 0
  };

  //是否显示选择老年人对话框
  isShowOldDialog = false;

  //是否显示选择合同模板对话框
  isShowContractDialog = false;

  dateFormat = "yyyy-MM-dd";
  oldInfo;
  contractInfo;
  // 合同图片模式保存的地址
  public dischargeUrls = "";


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    if (!this.oldInfo || Utils.isEmpty(this.oldInfo.id)) {
      this.showOldDialog();
    }
  }

  backToList() {
    history.back();
  }

  /**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }

  /**
   * 显示老年人选择对话框，并加载老年人列表
   */
  showOldDialog() {

    if (this.isModifyMode) {
      return;
    }
    this.isShowOldDialog = true;
    this.loadingOldList();
  }

  /**
   * 加载老年人列表
   */
  loadingOldList() {
    const that = this;

    that.oldQueryParams.key = that.searchOldName;
    that.isOldTableLoading = true;
    let param = this.httpReq.get(
      "sickWard/listByNameAndIdCard",
      this.oldQueryParams,
      data => {
        that.isOldTableLoading = false;
        if (data["status"] == 200) {
          this.oldDataArray = data["data"]; // 数据列表
        }
      }
    );
  }

  /**
   * 老年人选择对话框中选择了某个老年人；
   */
  chooseOld(oldInfo) {
    this.oldInfo = oldInfo;
    this.isShowOldDialog = false;
    this.saveContractParams.oldmanId = this.oldInfo.id;

    if (Utils.isEmpty(this.saveContractParams.templateId)) {
      this.showContractDialog();
    }
  }

  /**
   * 取消显示选择合同模板对话框
   */
  cancelContractDialog() {
    this.isShowContractDialog = false;
  }

  /**
   * 显示合同模板选择对话框，并加载合同模板列表
   */
  showContractDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    if (this.isModifyMode) {
      return;
    }
    this.isShowContractDialog = true;
    this.loadingContractList();
  }

  /**
   * 加载合同模板列表
   */
  loadingContractList(reset: boolean = false) {
    this.isContractTableLoading = true;
    if (reset) {
      this.contractqueryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.contractqueryParams.page = this.contractqueryParams.page - 1;
      if (this.contractqueryParams.page < 0) {
        this.contractqueryParams.page = 0;
      }
    }
    let that = this;
    let param = this.httpReq.get(
      "doctorPatientCommunication/listTemplate",
      this.contractqueryParams,
      data => {
        that.contractqueryParams.page++;
        that.isContractTableLoading = false;
        if (data["status"] == 200) {
          this.contractDataArray = data["data"]["content"]; // 数据列表
          this.contractResultData.totalElements = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }

  /**
   * 合同模板对话框中选择了某个老年人；
   */
  chooseContract(contract) {
    console.log('tag', contract)
    this.contractInfo = contract;
    this.isShowContractDialog = false;

    this.saveContractParams.templateId = this.contractInfo.id;
    this.saveContractParams.templateName = this.contractInfo.name;
    if (!Utils.isEmpty(this.contractInfo.formConfiguration)) {
      this.saveContractParams.formConfiguration = this.contractInfo.formConfiguration;
      this.templateContent = JSON.parse(this.contractInfo.formConfiguration);
    }
  }

  /**
   * 保存合同到服务器
   */
  saveContract(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (Utils.isEmpty(this.saveContractParams.oldmanId)) {
      this.message.warning("请选择合同所要签订的老年人！");
      return;
    }
    if (Utils.isEmpty(this.saveContractParams.templateId)) {
      this.message.warning("请选择所要使用的合同模板！");
      return;
    }

    this.saveContractParams.formConfiguration = JSON.stringify(this.templateContent);

    let that = this;
    that.saveBtnLoading = true;
    let param = this.httpReq.post(
      "doctorPatientCommunication/saveDoctorPatientCommunication",
      null,
      this.saveContractParams,
      data => {
        that.saveBtnLoading = false;
        if (data["status"] == 200) {
          that.message.success("保存成功！");
          that.back();
        }
      }
    );
  }

  back() {
    history.back();
  }

}
