import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import * as _ from "underscore"; // JS工具类
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { FormValidService } from "../../../common/service/FormValid.Service";
import { RegexpConfig } from "../../../common/service/GlobalConfig"; //
import { Local } from "../../../common/service/Storage";
import { GlobalMethod } from "../../../common/service/GlobalMethod";
import { LocalStorage } from "../../../common/service/local.storage";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-consult-add",
  templateUrl: "./consult-add.component.html",
  styleUrls: ["./consult-add.component.css"]
})
export class ConsultAddComponent implements OnInit {
  isDataLoading = false;
  saveBtnLoading = false;
  user;

  public formData: FormGroup; // 定义表单对象
  public getParam: any; // 传递过来的参数
  public asseLevelArr: Array<any> = []; // 评估等级数组

  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private router: Router, // 跳转路由
    private actRoute: ActivatedRoute, // 获取传递的参数
    private fb: FormBuilder, // 响应式表单
    private msg: NzMessageService, // 消息提醒
    private localStorage: LocalStorage
  ) {}
  // name: ["", [Validators.required, FormValidService.nameValid]],
  // mobile: ["", [Validators.required, FormValidService.mobileValid]],
  // idCard: ["", [Validators.required, FormValidService.idCardValid]],
  // telephone: ["", [Validators.required, FormValidService.telephoneValid]],
  // phone: ["", [Validators.required, FormValidService.phoneValid]],
  // mobile1: ["", [Validators.pattern(RegexpConfig.mobile)]]

  ngOnInit() {
    this.user = this.localStorage.getUser();
    console.log(this.user);
    const that = this;
    this.formData = this.fb.group({
      name: ["", [Validators.required, FormValidService.nameValid]], // 姓名
      sex: ["", [Validators.required]], // 性别
      birthYearMonth: ["", [Validators.required]], // 出生年月
      address: [""], // 现住址
      estimatedTime: ["", [Validators.required]], // 预计到访/入住时间(日期)
      assessmentLevel: [""], // 评估等级
      roomIntention: [""], // 房间意向
      estimatedPrice: [""], // 预估价位
      medicalHistory: [""], // 病史
      habitsHobbies: [""], // 生活习性、爱好
      understandChannel: [""], // 了解渠道
      suggestion: [""], // 意见或建议
      reviewInfo: this.fb.array([]), // 回访或跟进信息
      phone: ["", [Validators.pattern(RegexpConfig.phone)]], // 联系电话
      oneself: [""], // 信息提供者是否本人
      theName: ["", [Validators.pattern(RegexpConfig.name)]], // 信息提供者姓名
      relationship: [""], // 与托养人关系
      isProvider: [""], // 是否经济供养人
      consultingType: [""], // 咨询方式 1、微信咨询 2、电话咨询 3、来院咨询
      consultingTime: ["", [Validators.required]], // 咨询时间（时间）
      attendant: ["", [Validators.pattern(RegexpConfig.name)]], // 接待人
      memo: [""], // 备注
      noteTaker: [""], // 记录人
      accountId: [""] // 登录ID
    });

    // 给整个表单对象赋值
    // this.formData.patchValue();

    GlobalMethod.setForm(this.formData, {
      noteTaker: this.user.data.name, // 记录人
      accountId: this.user.data.id // 记录人
    });

    this.getParam = this.actRoute.snapshot.paramMap["params"]; // 传递过来的参数
    // state: edit 编辑 reception 接待  detail 详情
    if (
      this.getParam.state == "edit" ||
      this.getParam.state == "reception" ||
      this.getParam.state == "detail"
    ) {
      if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
        const reqObj: any = {};
        reqObj.id = this.getParam.id;
        this.isDataLoading = true;
        this.httpReq.post("consulting/findById", null, reqObj, data => {
          this.isDataLoading = false;

          if (data["code"] == 0) {
            data["data"]["oneself"] = data["data"]["oneself"].toString(); // 信息提供者
            data["data"]["isProvider"] = data["data"]["isProvider"].toString(); // 经济供养人
            data["data"]["consultingType"] = data["data"][
              "consultingType"
            ].toString(); // 经济供养人
            data["data"]["reviewInfo"] = JSON.parse(data["data"]["reviewInfo"]);

            GlobalMethod.setForm(this.formData, data["data"]); // 表单赋值
            const reviewInfoArr = data["data"]["reviewInfo"];
            for (let i = 0; i < reviewInfoArr.length; i++) {
              const revObj = this.fb.group({
                reviewId: [reviewInfoArr[i].reviewId], // 回访信息id(新增传空)
                reviewNum: [reviewInfoArr[i].reviewNum], // 次数
                reviewTime: [reviewInfoArr[i].reviewTime], // 时间
                reviewContent: [reviewInfoArr[i].reviewContent], // 回访内容
                reviewResult: [reviewInfoArr[i].reviewResult], // 回访结果
                reviewer: [reviewInfoArr[i].reviewer] // 回访人
              });
              const reviewArr = this.formData.get("reviewInfo") as FormArray;
              reviewArr.push(revObj); // 推送新表单
            }
          }
        });
      } else {
        that.msg.warning("未获取到ID");
        that.jumpPage("../");
      }
    }

    if (this.getParam.state == "reception") {
      // 接待
      const formDataCtrl = this.formData.controls;
      for (const i in formDataCtrl) {
        // 禁用部分表单
        if (i != "attendant" && i != "memo") {
          formDataCtrl[i].disable();
        }
      }
    } else if (this.getParam.state == "detail") {
      // 详情
      GlobalMethod.disableForm(this.formData); // 禁用整个表单
    }
    //   console.log(this.actRoute.snapshot.params);
    //   this.actRoute.params.subscribe(params => {
    //     console.log(params); //res 就为传来的参数，是对象的格式
    //   });
    //   console.log(this.actRoute.snapshot.paramMap["params"]);
    // }
  }

  /**
   * 创建回访或跟进信息对象
   * @public
   * @returns 返回回访或跟进信息表单对象
   * @memberof ConsultAddComponent
   */
  public creRevInfoObj() {
    const revInfoObj: any = this.fb.group({
      reviewId: [""], // 回访信息id(新增传空)
      reviewNum: [""], // 次数
      reviewTime: [""], // 时间
      reviewContent: [""], // 回访内容
      reviewResult: [""], // 回访结果
      reviewer: [""] // 回访人
    });
    return revInfoObj;
  }

  /**
   * 添加回访或跟进信息对象进表单组数
   * @public
   * @memberof ConsultAddComponent
   */
  public addRevInfoObj() {
    const reviewInfoArr = this.formData.get("reviewInfo") as FormArray;
    reviewInfoArr.push(this.creRevInfoObj()); // 推送新表单
  }

  /**
   * 删除回访或跟进信息对象
   * @public
   * @memberof ConsultAddComponent
   */
  public rmRevInfoObj(i: number) {
    const reviewInfoArr = this.formData.get("reviewInfo") as FormArray;
    reviewInfoArr.removeAt(i); // 根据索引移除对应的表单对象
  }

  /**
   * 改变路由跳转页面
   * @param {string} url 相对路由或绝对路径 ex:'info'或'../info'或'/nursingHome/medical'
   * @param {*} paramObj 要传递的参数信息
   */
  public jumpPage(url: string, param?: any): void {
    if (param) {
      GlobalMethod.changeRoute(url, this.router, this.actRoute, param);
    } else {
      GlobalMethod.changeRoute(url, this.router, this.actRoute);
    }
  }

  /**
   * 单击返回按钮
   * @memberof ConsultAddComponent
   */
  public clickBack() {
    this.jumpPage("../"); // 返回上一级
    // window.history.back(); // 调用浏览器window对象返回方法
  }

  /**
   * 保存表单数据
   * @returns
   * @memberof ConsultAddComponent
   */
  public saveForm() {
    const that = this;
    const formDataCtrl = this.formData.controls;
    const formData = this.jsUtil.deepClone(this.formData.value); // 深度拷贝表单数据
    for (const i in formDataCtrl) {
      // 较验整个表单标记非法字段
      formDataCtrl[i].markAsDirty();
      formDataCtrl[i].updateValueAndValidity();
      // if (i == "reviewInfo") {
      //   const revInfoObjCtrl = formDataCtrl[i]["controls"];
      //   console.log(revInfoObjCtrl);
      //   for (const m in revInfoObjCtrl) {
      //     console.log(revInfoObjCtrl[m]);
      //     revInfoObjCtrl[m].markAsDirty();
      //     revInfoObjCtrl[m].updateValueAndValidity();
      //   }
      // }
    }
    console.log(this.formData);
    console.log(formData);
    if (this.formData.invalid) {
      // 表单较验未通过
      return;
    }
    formData.birthYearMonth = this.jsUtil.dateFormat(formData.birthYearMonth); // 出生年月
    formData.consultingTime = this.jsUtil.dateFormat(formData.consultingTime); // 咨询时间
    formData.estimatedTime = this.jsUtil.dateFormat(formData.estimatedTime); // 入住时间
    const revInfoArr = formData.reviewInfo;
    for (let i = 0; i < revInfoArr.length; i++) {
      if (!_.isNull(revInfoArr[i].reviewTime)) {
        revInfoArr[i].reviewTime = this.jsUtil.dateFormat(
          revInfoArr[i].reviewTime
        );
      }
    }

    console.log(formData);
    this.saveBtnLoading = true;
    if (this.getParam.state == "add") {
      // 添加
      this.httpReq.post("consulting/saveOrUpdate", null, formData, data => {
        that.saveBtnLoading = false;
        if (data["code"] == 0) {
          that.msg.success("保存成功！");
          that.jumpPage("../");
        }
      });
    } else if (
      this.getParam.state == "edit" ||
      this.getParam.state == "reception"
    ) {
      // 编辑、接待
      if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
        formData.id = this.getParam.id;
        this.httpReq.post("consulting/saveOrUpdate", null, formData, data => {
          that.saveBtnLoading = false;
          if (data["code"] == 0) {
            that.msg.success("保存成功！");
            that.jumpPage("../");
          }
        });
      } else {
        that.msg.warning("未获取到ID");
        that.jumpPage("../");
      }
    }
  }

  SaveReceptionParams = {
    id: "", //"咨询服务信息id",
    attendant: "", //"接待人",
    memo: "", //"备注",
    modifier: "" //"修改人"
  };

  public SaveReception() {
    const that = this;
    const formData = this.formData.value;

    //判断是否填写接待人
    if (Utils.isEmpty(formData.attendant)) {
      that.msg.error("请填写接待人！");
      return;
    }
    this.saveBtnLoading = true;
    // 编辑、接待
    this.SaveReceptionParams.id = this.getParam.id;
    this.SaveReceptionParams.attendant = formData.attendant;
    this.SaveReceptionParams.memo = formData.memo;
    this.SaveReceptionParams.modifier = formData.noteTaker;
    console.log(formData.noteTaker);
    this.httpReq.post(
      "consulting/wxReception",
      null,
      this.SaveReceptionParams,
      data => {
        that.saveBtnLoading = false;
        if (data["code"] == 0) {
          that.msg.success("保存成功！");
          that.jumpPage("../");
        }
      }
    );
  }
}
