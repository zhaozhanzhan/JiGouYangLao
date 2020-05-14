import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import * as _ from "underscore"; // JS工具类
import { EventEmitter } from "events";
import { ENgxPrintComponent } from "e-ngx-print";
import { HttpReqService } from "src/app/common/service/HttpUtils.Service";
import { JsUtilsService } from "src/app/common/service/JsUtils.Service";
import { LocalStorage } from "src/app/common/service/local.storage";
import { GlobalMethod } from "src/app/common/service/GlobalMethod";
import { Local } from "src/app/common/service/Storage";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  public isDataLoading: boolean = false;
  public saveBtnLoading: boolean = false;
  public user: any;

  public formData: FormGroup; // 定义表单对象
  public goodsData: FormGroup; // 物品对象
  public goodsList: Array<any> = []; // 物品列表
  public getParam: any; // 传递过来的参数

  public isShowGoodsBox: boolean = false; // 是否显示物品模态框
  public isBtnLoading: boolean = false; // 保存按钮加载动画

  public drugList: Array<any> = []; // 药品列表
  public selDrugObj: any = {}; // 选择的药品对象
  public serDrugName: string = ""; // 药品名称
  public drugDataState: string = "add"; // 编辑药品的状态 'add' 'edit'
  public drugDataIndex: number; // 编辑药品的索引值

  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = [
    "assets/css/common.css",
    "assets/css/ng-zorro-antd.min.css"
  ]; // 打印内容css文件路径
  public printStyle: string = ``;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件

  public tagName: string = ""; // 打印标题
  public month: string = ""; // 月份
  public day: string = ""; // 日
  public departmentName: string = ""; // 部门
  public approveInfo: any = {
    id: "", // 药品采购申请表id
    approvalName: "", // 审批人
    approvalUrl: "", // 电子签名
    approvalDate: "", // 审批时间
    accountId: "" // 登陆账户i
  }; // 审批信息

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
      id: [""], // String	采购申请主键Id
      title: ["", [Validators.required]], // String	申请概述
      applyDate: [new Date(), [Validators.required]], // Date	申请时间
      applyCompany: ["", [Validators.required]], // String	申请单位
      applyer: ["", [Validators.required]], // String	申请人
      comment: ["", []], // String	申请备注
      accountId: ["", [Validators.required]] // String	登陆账户id

      // name: ["", [Validators.required, FormValidService.nameValid]], // 姓名
      // sex: ["", [Validators.required]], // 性别
      // birthYearMonth: ["", [Validators.required]], // 出生年月
      // address: [""], // 现住址
      // estimatedTime: ["", [Validators.required]], // 预计到访/入住时间(日期)
      // assessmentLevel: [""], // 评估等级
      // roomIntention: [""], // 房间意向
      // estimatedPrice: [""], // 预估价位
      // medicalHistory: [""], // 病史
      // habitsHobbies: [""], // 生活习性、爱好
      // understandChannel: [""], // 了解渠道
      // suggestion: [""], // 意见或建议
      // reviewInfo: this.fb.array([]), // 回访或跟进信息
      // phone: ["", [Validators.pattern(RegexpConfig.phone)]], // 联系电话
      // oneself: [""], // 信息提供者是否本人
      // theName: ["", [Validators.pattern(RegexpConfig.name)]], // 信息提供者姓名
      // relationship: [""], // 与托养人关系
      // isProvider: [""], // 是否经济供养人
      // consultingType: [""], // 咨询方式 1、微信咨询 2、电话咨询 3、来院咨询
      // consultingTime: ["", [Validators.required]], // 咨询时间（时间）
      // attendant: ["", [Validators.pattern(RegexpConfig.name)]], // 接待人
      // memo: [""], // 备注
      // noteTaker: [""], // 记录人
      // accountId: [""] // 登录ID
    });

    // 给整个表单对象赋值
    // this.formData.patchValue();

    this.goodsData = this.fb.group({
      rMedId: ["", []], //	String	采购申请药品表主键id
      medName: [""], //	String	药品名称
      medId: ["", [Validators.required]], //	String	药品id
      salePrice: [""], //	Double	单价
      num: ["0", [Validators.required]], //	number	申请数量
      medComment: ["", []] //	String	申请药品备注
    });

    GlobalMethod.setForm(this.formData, {
      applyer: this.user.data.name, // 记录人
      accountId: this.user.data.id // 记录人ID
    });

    this.serDrug(""); // 查询药品数据
    this.getParam = this.actRoute.snapshot.paramMap["params"]; // 传递过来的参数
    // state: edit 编辑 reception 接待  detail 详情
    if (
      this.getParam.state == "edit" ||
      this.getParam.state == "detail" ||
      this.getParam.state == "approval"
    ) {
      if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
        const reqObj: any = {};
        reqObj.id = this.getParam.id;
        this.isDataLoading = true;
        this.httpReq.post(
          "med_requisition/listDetail",
          null,
          reqObj,
          (data: any) => {
            this.isDataLoading = false;

            if (data["code"] == 0) {
              this.goodsList = data["data"]["medRequisitions"]; // 信息提供者

              try {
                let first = data["data"].createDate.split(" ")[0];
                this.month = first.split("-")[1];
                this.day = first.split("-")[2];
                this.departmentName = data["data"].applyCompany;
              } catch (error) {}

              if (this.getParam.state == "detail") {
                this.approveInfo.approvalName = data["data"].approvalName;
                this.approveInfo.approvalDate = data["data"].approvalDate;
                this.approveInfo.approvalUrl = data["data"].approvalUrl;
              }
              GlobalMethod.setForm(this.formData, data["data"]); // 表单赋值
              // const reviewInfoArr = data["data"]["reviewInfo"];
              // for (let i = 0; i < reviewInfoArr.length; i++) {
              //   const revObj = this.fb.group({
              //     reviewId: [reviewInfoArr[i].reviewId], // 回访信息id(新增传空)
              //     reviewNum: [reviewInfoArr[i].reviewNum], // 次数
              //     reviewTime: [reviewInfoArr[i].reviewTime], // 时间
              //     reviewContent: [reviewInfoArr[i].reviewContent], // 回访内容
              //     reviewResult: [reviewInfoArr[i].reviewResult], // 回访结果
              //     reviewer: [reviewInfoArr[i].reviewer] // 回访人
              //   });
              //   const reviewArr = this.formData.get("reviewInfo") as FormArray;
              //   reviewArr.push(revObj); // 推送新表单
              // }
            }
          }
        );
      } else {
        that.msg.warning("未获取到ID");
        that.jumpPage("../");
      }
    }

    if (this.getParam.state == "detail" || this.getParam.state == "approval") {
      // 详情
      GlobalMethod.disableForm(this.formData); // 禁用整个表单
    }

    if (this.getParam.state == "approval") {
      this.approveInfo.id = this.getParam.id;
      try {
        this.approveInfo.approvalName = this.user.data.name;
        this.approveInfo.accountId = this.user.data.id;
      } catch (error) {}
    }

    //   console.log(this.actRoute.snapshot.params);
    //   this.actRoute.params.subscribe(params => {
    //     console.log(params); //res 就为传来的参数，是对象的格式
    //   });
    //   console.log(this.actRoute.snapshot.paramMap["params"]);
    // }
  }

  /**
   * 查询药品数据
   * @param {string} name
   * @memberof AddComponent
   */
  public serDrug(name: string = "") {
    const reqObj: any = { page: 0, size: 10, search: name };
    this.httpReq.post("med_drug/listPage", null, reqObj, (data: any) => {
      if (data["code"] == 0) {
        this.drugList = data["data"]["content"];
      } else {
        this.drugList = [];
      }
    });
  }

  /**
   * 选择药品
   * @memberof AddComponent
   */
  public selDrug(ev: any) {
    console.log(ev);
    let drugObj: any;
    if (!_.isNull(ev) && !_.isUndefined(ev) && ev.length > 2) {
      const drugArr: Array<any> = ev.split("|");
      drugObj = {
        medName: drugArr[1], //	String	药品名称
        medId: drugArr[0], //	String	药品id
        salePrice: drugArr[2] //	Double	单价
      };
    } else {
      drugObj = {
        medName: "", //	String	药品名称
        medId: "", //	String	药品id
        salePrice: "" //	Double	单价
      };
    }
    GlobalMethod.setForm(this.goodsData, drugObj); // 表单赋值
  }

  /**
   * 删除药品
   * @param {number} i 索引
   * @memberof AddComponent
   */
  public delDrug(i: number) {
    this.goodsList.splice(i, 1);
  }

  /**
   * 修改药品
   * @param {*} obj
   * @memberof AddComponent
   */
  public editDrug(obj: any, state: string = "edit", i: number) {
    this.drugDataState = state; // 编辑药品的状态 'add' 'edit'
    this.drugDataIndex = i; // 编辑药品的索引值
    this.serDrug(""); // 查询药品数据
    this.selDrugObj = obj.medId + "|" + obj.medName + "|" + obj.salePrice;
    GlobalMethod.setForm(this.goodsData, obj); // 表单赋值
    this.isShowGoodsBox = true;
    const goodsDataCtrl = this.goodsData.controls;
    const goodsData = this.jsUtil.deepClone(this.goodsData.value); // 深度拷贝表单数据
    console.log(goodsData);
  }

  /**
   * 创建回访或跟进信息对象
   * @public
   * @returns 返回回访或跟进信息表单对象
   * @memberof ConsultAddComponent
   */
  // public creRevInfoObj() {
  //   const revInfoObj: any = this.fb.group({
  //     rMedId: ["", []], // 	String	采购申请药品表主键id
  //     medId: ["", []], // 	String	药品id
  //     num: ["", []], // 	number	申请数量
  //     salePrice: ["", []], // 	Double	售价
  //     medComment: ["", []] // 	String	申请药品备注
  //   });
  //   return revInfoObj;
  // }

  /**
   * 添加回访或跟进信息对象进表单组数
   * @public
   * @memberof ConsultAddComponent
   */
  // public addRevInfoObj() {
  //   const reviewInfoArr = this.formData.get("reviewInfo") as FormArray;
  //   reviewInfoArr.push(this.creRevInfoObj()); // 推送新表单
  // }

  /**
   * 删除回访或跟进信息对象
   * @public
   * @memberof ConsultAddComponent
   */
  // public rmRevInfoObj(i: number) {
  //   const reviewInfoArr = this.formData.get("reviewInfo") as FormArray;
  //   reviewInfoArr.removeAt(i); // 根据索引移除对应的表单对象
  // }

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
   * 打开新增物品模态框
   * @memberof AddComponent
   */
  public openGoodsModal(state: string = "add") {
    this.drugDataState = state; // 编辑药品的状态 'add' 'edit'
    this.serDrug(""); // 查询药品数据
    const drugObj: any = {
      rMedId: "", //	String	采购申请药品表主键id
      medName: "", //	String	药品名称
      medId: "", //	String	药品id
      salePrice: "", //	Double	单价
      num: "0", //	number	申请数量
      medComment: "" //	String	申请药品备注
    };
    this.selDrugObj = "";
    GlobalMethod.setForm(this.goodsData, drugObj); // 表单赋值
    this.isShowGoodsBox = true;
  }

  /**
   * 保存新增数据
   * @memberof AddComponent
   */
  public saveGoods() {
    const goodsDataCtrl = this.goodsData.controls;
    const goodsData = this.jsUtil.deepClone(this.goodsData.value); // 深度拷贝表单数据
    for (const i in goodsDataCtrl) {
      // 较验整个表单标记非法字段
      goodsDataCtrl[i].markAsDirty();
      goodsDataCtrl[i].updateValueAndValidity();
    }
    console.log(this.goodsData);
    console.log(goodsData);
    if (this.goodsData.invalid) {
      // 表单较验未通过
      return;
    }
    if (this.drugDataState == "add") {
      this.goodsList.push(goodsData);
    } else if (this.drugDataState == "edit") {
      this.goodsList.splice(this.drugDataIndex, 1, goodsData);
    }
    this.isShowGoodsBox = false;
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
    formData.applyDate = this.jsUtil.dateFormat(
      formData.applyDate,
      "YYYY-MM-DD HH:mm:ss"
    ); // 申请时间
    console.log(this.formData);
    console.log(formData);
    console.log(formData);
    if (this.goodsList.length > 0) {
      formData.medList = this.jsUtil.deepClone(this.goodsList);
    } else {
      this.msg.warning("请添加要采购的药品！");
      return;
    }
    this.saveBtnLoading = true;

    if (this.getParam.state == "add") {
      // 添加
    } else if (this.getParam.state == "edit") {
      // 修改
      if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
        formData.id = this.getParam.id;
      } else {
        that.msg.warning("未获取到ID");
        that.jumpPage("../");
        return;
      }
    }

    this.httpReq.post(
      "med_requisition/saveMedRequisition",
      null,
      formData,
      (data: any) => {
        that.saveBtnLoading = false;
        if (data["code"] == 0) {
          that.msg.success("保存成功！");
          that.jumpPage("../");
        }
      }
    );

    // if (this.getParam.state == "add") {
    //   // 添加

    // } else if (this.getParam.state == "edit") {
    //   // 编辑、接待
    //   if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
    //     formData.id = this.getParam.id;
    //     this.httpReq.post("consulting/saveOrUpdate", null, formData, (data:any) => {
    //       that.saveBtnLoading = false;
    //       if (data["code"] == 0) {
    //         that.msg.success("保存成功！");
    //         that.jumpPage("../");
    //       }
    //     });
    //   } else {
    //     that.msg.warning("未获取到ID");
    //     that.jumpPage("../");
    //   }
    // }
  }

  // 获得打印的标头名字
  public getLocalConfig() {
    let config = Local.getObj("serveConfig");
    this.tagName = config.originFullName;
  }

  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof MedicalRecordComponent
   */
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.getLocalConfig(); // 获得打印的标头名字
    this.isPrintNow = true; // 正在打印
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isPrintNow = false;
  }

  /**
   * 确认审批
   * @param {*} signImg
   * @memberof AddComponent
   */
  public saveApprove(signImg: any) {
    this.approveInfo.approvalUrl = signImg;
    console.log(this.approveInfo);
    this.isBtnLoading = true;
    this.httpReq.post(
      "med_requisition/approveApply",
      null,
      this.approveInfo,
      (data: any) => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.msg.success("保存成功！");
          this.jumpPage("../");
        }
      }
    );
  }
}
