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
  selector: "app-in-storehouse",
  templateUrl: "./in-storehouse.component.html",
  styleUrls: ["./in-storehouse.component.css"]
})
export class InStorehouseComponent implements OnInit {
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
  public selIdArr: Array<string> = []; // 已经选择的药品ID数组

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
  
    const that = this;
    // {
    //   "id": "药品采购申请Id",
    //   "inDate": "入库时间",
    //   "operator": "操作人",
    //   "inComment": "入库备注",
    //   "accountId": "账户Id",
    //   "inMedList": [{
    //     "autoNum": "自动编号（不可修改1，2，3…）",
    //     "rMedId": "采购申请物品id",
    //     "inNum": "入库数量",
    //     "leftNum": "剩余数量",
    //     "inPrice": "入库单价",
    //     "mdBatchNum": "入库药品批号",
    //     "supplier": "供应商",
    //     "productionDate": "生产日期",
    //     "shelfLife": "保质期",
    //     "medComment": "药品备注"
    //   }]
    // }
    this.formData = this.fb.group({
      id: [""], // String	药品采购申请Id
      inDate: [new Date(), [Validators.required]], // Date	入库时间
      operator: ["", [Validators.required]], // String	操作人
      inComment: ["", []], // String	入库备注
      accountId: ["", [Validators.required]] // String	登陆账户id

      // name: ["", [Validators.required, FormValidService.nameValid]], // 姓名
      // reviewInfo: this.fb.array([]), // 回访或跟进信息
      // phone: ["", [Validators.pattern(RegexpConfig.phone)]], // 联系电话
      // theName: ["", [Validators.pattern(RegexpConfig.name)]], // 信息提供者姓名
      // consultingTime: ["", [Validators.required]], // 咨询时间（时间）
      // attendant: ["", [Validators.pattern(RegexpConfig.name)]], // 接待人
      // accountId: [""] // 登录ID
    });

    // 给整个表单对象赋值
    // this.formData.patchValue();

    this.goodsData = this.fb.group({
      autoNum: ["", []], // 自动编号（不可修改1，2，3…）
      rMedId: ["", [Validators.required]], //	采购申请药品表主键id
      medName: ["", []], //	药品名称
      inNum: ["", [Validators.required]], //	入库数量
      leftNum: ["", []], //	剩余数量
      inPrice: ["", []], //	入库单价
      reqPrice: ["", []], //	采购单价
      mdBatchNum: ["", []], //	入库药品批号
      supplier: ["", []], //	供应商
      productionDate: ["", [Validators.required]], //	生产日期
      shelfLife: ["", [Validators.required]], //	保质期
      medComment: ["", []] //	药品备注
    });

    GlobalMethod.setForm(this.formData, {
      operator: this.user.data.name, // 记录人
      accountId: this.user.data.id // 记录人ID
    });

    this.getParam = this.actRoute.snapshot.paramMap["params"]; // 传递过来的参数

    if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
      this.serDrug(this.getParam.id); // 查询待入库药品数据
    }
  }

  /**
   * 查询待入库药品数据
   * @param {string} id
   * @memberof AddComponent
   */
  public serDrug(id: string) {
    const reqObj: any = { id: id };
    this.httpReq.post(
      "med_requisition/listWaitInStore",
      null,
      reqObj,
      (data: any) => {
        if (data["code"] == 0) {
          this.drugList = data["data"];
        } else {
          this.drugList = [];
        }
      }
    );
  }

  /**
   * 选择药品
   * @memberof AddComponent
   */
  public selDrug(ev: any) {
    let drugObj: any;
    if (_.isObject(ev) && !_.isEmpty(ev)) {
      
      drugObj = {
        rMedId: ev.rMedId, //	String	采购申请药品表主键id
        medName: ev.medName, // 药品名称
        inNum: ev.leftNum, //	String	入库数量
        leftNum: ev.leftNum, //	Double	未入库数量
        reqPrice: ev.reqPrice, //	Double	未入库数量
        inPrice: ev.salePrice //	Double	单价
      };
      this.selIdArr.push(ev.rMedId);
    } else {
      drugObj = {
        rMedId: "", //	String	采购申请药品表主键id
        medName: "", // 药品名称
        inNum: "", //	String	入库数量
        leftNum: "", //	Double	未入库数量
        inPrice: "", //	Double	单价
        reqPrice: "" // Double	采购单价
      };
      const idx = this.selIdArr.indexOf(ev.rMedId);
      this.selIdArr.splice(idx, 1);
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
    this.selIdArr = []; // 已经选择的药品ID数组
    for (let i = 0; i < this.goodsList.length; i++) {
      this.selIdArr.push(this.goodsList[i].rMedId);
    }
    this.drugDataState = state; // 编辑药品的状态 'add' 'edit'
    this.drugDataIndex = i; // 编辑药品的索引值
    // this.serDrug(""); // 查询药品数据
    // this.selDrugObj = obj.medName;
    GlobalMethod.setForm(this.goodsData, obj); // 表单赋值
    this.isShowGoodsBox = true;
    const goodsDataCtrl = this.goodsData.controls;
    const goodsData = this.jsUtil.deepClone(this.goodsData.value); // 深度拷贝表单数据
  
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
    this.selIdArr = []; // 已经选择的药品ID数组
    for (let i = 0; i < this.goodsList.length; i++) {
      this.selIdArr.push(this.goodsList[i].rMedId);
    }
    this.drugDataState = state; // 编辑药品的状态 'add' 'edit'
    // this.serDrug(""); // 查询药品数据
    const drugObj: any = {
      autoNum: "", // 自动编号（不可修改1，2，3…）
      rMedId: "", //	采购申请药品表主键id
      medName: "", //	药品名称
      inNum: "", //	入库数量
      leftNum: "", //	剩余数量
      inPrice: "", //	入库单价
      mdBatchNum: "", //	入库药品批号
      supplier: "", //	供应商
      productionDate: "", //	生产日期
      shelfLife: "", //	保质期
      reqPrice: "", //采购单价
      medComment: "" //	药品备注
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
    if (this.goodsData.invalid) {
      // 表单较验未通过
      return;
    }
    if (goodsData.inNum > goodsData.leftNum) {
      // 表单较验未通过
      this.msg.error("入库数量不能大于未入库数量");
      return;
    }
    if (this.drugDataState == "add") {
      goodsData.productionDate = this.jsUtil.dateFormat(
        goodsData.productionDate
      );
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
    
    }
    if (this.formData.invalid) {
      // 表单较验未通过
      return;
    }
    formData.inDate = this.jsUtil.dateFormat(
      formData.inDate,
      "YYYY-MM-DD HH:mm:ss"
    ); // 申请时间
    if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
      formData.id = this.getParam.id;
    } else {
      that.msg.warning("未获取到ID");
      return;
    }
    if (this.goodsList.length > 0) {
      for (let i = 0; i < this.goodsList.length; i++) {
        console.warn(this.goodsList[i]);
        this.goodsList[i].autoNum = i + 1;
        this.goodsList[i].productionDate = this.jsUtil.dateFormat(
          this.goodsList[i].productionDate
        );
      }
      formData.inMedList = this.jsUtil.deepClone(this.goodsList);
    } else {
      this.msg.warning("请添加要入库的药品！");
      return;
    }
    this.saveBtnLoading = true;
  

    this.httpReq.post(
      "med_requisition/requisitionInStore",
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
}
