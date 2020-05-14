import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-rehabilitationRegistrationAdd",
  templateUrl: "./rehabilitationRegistrationAdd.component.html",
  styleUrls: ["./rehabilitationRegistrationAdd.component.css"]
})
export class RehabilitationRegistrationAddComponent implements OnInit {
  // 显示老人弹出框
  isShowOldDialog = false;
  // 加载老人的参数
  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    appayType: ""
  };
  //老年人选择对话框检索
  searchOldName = "";
  //老年人列表table加载状态
  isOldTableLoading = false;
  // 老人的列表
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };
  // 获得用户信息变量
  userInfo;
  validateForm: FormGroup;

  // 点击老人时绑定页面的信息
  interview = {
    oldManId: "",
    name: "",
    sex: "",
    birthYearMonth: "",
    address: "",
    phone: "",
    nation: "",
    cardno: "",
    marriage: "",
    education: ""
  };
  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localStroage: LocalStorage,
    private jsUtil: JsUtilsService
  ) {
    this.validateForm = this.fb.group({
      name: ["", [Validators.required]],
      sex: ["", [Validators.required]],
      nation: [""],
      birthYearMonth: ["", [Validators.required]],
      cardNo: [""],
      phone: [""],
      marriage: [""],
      education: [""],
      medicalPayment: [""],
      otherPayment: [""],
      selfCareAbility: [""],
      address: [""],
      mjrDisVision: [""],
      mjrDisListen: [""],
      mjrDisIntelligence: [""],
      mjrDisSpirit: [""],
      mjrDisLang: [""],
      mjrDisBody: [""],
      disLevel: [""],
      disCause: [undefined],
      disCauseTime: [""],
      funcTrainVision: [undefined],
      funcTrainListenLang: [undefined],
      funcTrainIntelligence: [undefined],
      funcTrainSpirit: [undefined],
      funcTrainBody: [undefined],
      recMedReq: [undefined],
      assDevVision: [undefined],
      assDevListenLang: [undefined],
      assDevBody: [undefined],
      assDevSpirit: [undefined],
      assDevIntelligence: [undefined],
      assDevOther: [undefined],
      psyService: [undefined],
      otherReq: [""],
      comment: [""]
    });
  }

  savePersonalBtnLoading = false;
  medicalPaymentNumber;
  id;
  type;
  ShowDisabled = true;

  ngOnInit() {
    // 获得个人信息  accountId
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    // 编辑时获得的信息
    const rehabilitationStr = this.route.snapshot.paramMap.get("info");
    if (rehabilitationStr) {
      this.ShowDisabled = false;
      const rehabilitation = JSON.parse(rehabilitationStr);
      this.id = rehabilitation.id;
      this.interview.name = rehabilitation.name;
      this.interview.sex = rehabilitation.sex;
      this.interview.birthYearMonth = rehabilitation.birthYearMonth;
      this.interview.address = rehabilitation.address;
      this.interview.phone = rehabilitation.phone;
      this.interview.nation = rehabilitation.nation;
      this.interview.cardno = rehabilitation.cardNo;
      this.interview.marriage = rehabilitation.marriage;
      this.interview.education = rehabilitation.education;
      this.medicalPaymentNumber = rehabilitation.medicalPayment;
      if (rehabilitation.recMedReq != "") {
        rehabilitation.recMedReq = JSON.parse(rehabilitation.recMedReq);
      } else {
        rehabilitation.recMedReq = [];
      }

      if (rehabilitation.disCause != "") {
        rehabilitation.disCause = JSON.parse(rehabilitation.disCause);
      } else {
        rehabilitation.disCause = [];
      }

      if (rehabilitation.funcTrainVision != "") {
        rehabilitation.funcTrainVision = JSON.parse(
          rehabilitation.funcTrainVision
        );
      } else {
        rehabilitation.funcTrainVision = [];
      }
      // rehabilitation.funcTrainVision=JSON.parse(rehabilitation.funcTrainVision);
      if (rehabilitation.funcTrainListenLang != "") {
        rehabilitation.funcTrainListenLang = JSON.parse(
          rehabilitation.funcTrainListenLang
        );
      } else {
        rehabilitation.funcTrainListenLang = [];
      }
      // rehabilitation.funcTrainListenLang=JSON.parse(rehabilitation.funcTrainListenLang);
      if (rehabilitation.funcTrainIntelligence != "") {
        rehabilitation.funcTrainIntelligence = JSON.parse(
          rehabilitation.funcTrainIntelligence
        );
      } else {
        rehabilitation.funcTrainIntelligence = [];
      }
      // rehabilitation.funcTrainIntelligence=JSON.parse(rehabilitation.funcTrainIntelligence);
      if (rehabilitation.funcTrainSpirit != "") {
        rehabilitation.funcTrainSpirit = JSON.parse(
          rehabilitation.funcTrainSpirit
        );
      } else {
        rehabilitation.funcTrainSpirit = [];
      }
      // rehabilitation.funcTrainSpirit=JSON.parse(rehabilitation.funcTrainSpirit);
      if (rehabilitation.funcTrainBody != "") {
        rehabilitation.funcTrainBody = JSON.parse(rehabilitation.funcTrainBody);
      } else {
        rehabilitation.funcTrainBody = [];
      }
      // rehabilitation.funcTrainBody=JSON.parse(rehabilitation.funcTrainBody);
      if (rehabilitation.assDevVision != "") {
        rehabilitation.assDevVision = JSON.parse(rehabilitation.assDevVision);
      } else {
        rehabilitation.assDevVision = [];
      }
      // rehabilitation.assDevVision=JSON.parse(rehabilitation.assDevVision);
      if (rehabilitation.assDevListenLang != "") {
        rehabilitation.assDevListenLang = JSON.parse(
          rehabilitation.assDevListenLang
        );
      } else {
        rehabilitation.assDevListenLang = [];
      }
      // rehabilitation.assDevListenLang=JSON.parse(rehabilitation.assDevListenLang);
      if (rehabilitation.assDevBody != "") {
        rehabilitation.assDevBody = JSON.parse(rehabilitation.assDevBody);
      } else {
        rehabilitation.assDevBody = [];
      }
      // rehabilitation.assDevBody=JSON.parse(rehabilitation.assDevBody);
      if (rehabilitation.assDevSpirit != "") {
        rehabilitation.assDevSpirit = JSON.parse(rehabilitation.assDevSpirit);
      } else {
        rehabilitation.assDevSpirit = [];
      }
      // rehabilitation.assDevSpirit=JSON.parse(rehabilitation.assDevSpirit);
      if (rehabilitation.assDevIntelligence != "") {
        rehabilitation.assDevIntelligence = JSON.parse(
          rehabilitation.assDevIntelligence
        );
      } else {
        rehabilitation.assDevIntelligence = [];
      }
      // rehabilitation.assDevIntelligence=JSON.parse(rehabilitation.assDevIntelligence);
      if (rehabilitation.assDevOther != "") {
        rehabilitation.assDevOther = JSON.parse(rehabilitation.assDevOther);
      } else {
        rehabilitation.assDevOther = [];
      }
      // rehabilitation.assDevOther=JSON.parse(rehabilitation.assDevOther);
      if (rehabilitation.psyService != "") {
        rehabilitation.psyService = JSON.parse(rehabilitation.psyService);
      } else {
        rehabilitation.psyService = [];
      }
      // rehabilitation.psyService=JSON.parse(rehabilitation.psyService);
      this.validateForm.patchValue(rehabilitation);
    }
  }

  // 保存事件
  onSavePersonalInfo() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
    let reqObj = this.validateForm.value;
    reqObj.oldManId = this.interview.oldManId;
    reqObj.accountId = this.userInfo.id;
    reqObj.birthYearMonth = this.jsUtil.dateFormat(reqObj.birthYearMonth);
    reqObj.disCauseTime = this.jsUtil.dateFormat(reqObj.disCauseTime);
    this.savePersonalBtnLoading = true;
    if (!this.id) {
      this.httpReq.post("/rcBaseInfo/save", null, reqObj, data => {
        this.savePersonalBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    } else {
      reqObj.id = this.id;
      this.httpReq.post("/rcBaseInfo/edit", null, reqObj, data => {
        this.savePersonalBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            this.back();
          } else {
            this.message.error(data.message);
          }
        }
      });
    }
  }

  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
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
    this.isShowOldDialog = true;
    this.loadingOldList();
  }
  /**
   * 老年人选择对话框中选择了某个老年人；
   */

  chooseOld(oldInfo) {
    this.isShowOldDialog = false;
    if (oldInfo != null) {
      this.interview.oldManId = oldInfo.id;
      this.interview.name = oldInfo.name;
      this.interview.sex = oldInfo.sex;
      this.interview.birthYearMonth = oldInfo.birthYearMonth;
      this.interview.address = oldInfo.address;
      this.interview.phone = oldInfo.phone;
      this.interview.nation = oldInfo.nation;
      this.interview.cardno = oldInfo.cardno;
      this.interview.marriage = oldInfo.marriage;
      this.interview.education = oldInfo.education;
    }
  }
  /**
   * 加载老年人列表
   */
  loadingOldList(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.oldQueryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldQueryParams.page = this.oldQueryParams.page - 1;
      if (this.oldQueryParams.page < 0) {
        this.oldQueryParams.page = 0;
      }
    }
    that.oldQueryParams.name = that.searchOldName;
    that.isOldTableLoading = true;
    this.httpReq.post("/oldman/list", null, this.oldQueryParams, data => {
      that.oldQueryParams.page++;
      that.isOldTableLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.oldDataArray = data["data"]["content"]; // 数据列表
          this.oldResultData.totalElements = data["data"]["totalElements"]; // 总条数
        } else {
          this.message.error(data.message);
        }
      }
    });
  }

  // 返回
  back() {
    history.back();
  }
}
