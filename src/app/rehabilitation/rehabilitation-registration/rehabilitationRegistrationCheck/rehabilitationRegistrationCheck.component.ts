import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-rehabilitationRegistrationCheck",
  templateUrl: "./rehabilitationRegistrationCheck.component.html",
  styleUrls: ["./rehabilitationRegistrationCheck.component.css"]
})
export class RehabilitationRegistrationCheckComponent implements OnInit {
  // 获得用户信息变量
  userInfo;
  validateForm;

  // 点击老人时绑定页面的信息
  interview = {
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
      rehabilitation.recMedReq = JSON.parse(rehabilitation.recMedReq);
      rehabilitation.disCause = JSON.parse(rehabilitation.disCause);
      rehabilitation.funcTrainVision = JSON.parse(
        rehabilitation.funcTrainVision
      );
      rehabilitation.funcTrainListenLang = JSON.parse(
        rehabilitation.funcTrainListenLang
      );
      rehabilitation.funcTrainIntelligence = JSON.parse(
        rehabilitation.funcTrainIntelligence
      );
      rehabilitation.funcTrainSpirit = JSON.parse(
        rehabilitation.funcTrainSpirit
      );
      rehabilitation.funcTrainBody = JSON.parse(rehabilitation.funcTrainBody);
      rehabilitation.assDevVision = JSON.parse(rehabilitation.assDevVision);
      rehabilitation.assDevListenLang = JSON.parse(
        rehabilitation.assDevListenLang
      );
      rehabilitation.assDevBody = JSON.parse(rehabilitation.assDevBody);
      rehabilitation.assDevSpirit = JSON.parse(rehabilitation.assDevSpirit);
      rehabilitation.assDevIntelligence = JSON.parse(
        rehabilitation.assDevIntelligence
      );
      rehabilitation.assDevOther = JSON.parse(rehabilitation.assDevOther);
      rehabilitation.psyService = JSON.parse(rehabilitation.psyService);
      this.validateForm.patchValue(rehabilitation);
    }
  }

  // 保存事件
  onSavePersonalInfo() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let reqObj = this.validateForm.value;
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
  // 返回
  back() {
    history.back();
  }
}
