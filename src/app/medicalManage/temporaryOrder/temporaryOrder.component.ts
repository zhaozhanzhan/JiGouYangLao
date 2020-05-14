/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-10 09:43:23
 * @Description:
 */
import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { LocalStorage } from "../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { ENgxPrintComponent } from "e-ngx-print";
import * as _ from "underscore"; // Underscore工具类
import { parse } from "url";
import { constant } from "types/underscore";
@Component({
  selector: "app-temporaryOrder",
  templateUrl: "./temporaryOrder.component.html",
  styleUrls: ["./temporaryOrder.component.css"]
})
export class TemporaryOrderComponent implements OnInit {
  @Input() inHospitalInfoId: string; // 病人ID
  @Input("patientId")
  patientId: string; // 病人ID
  @ViewChild("mainScreen") elementView: ElementRef;
  viewHeight: any;

  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件
  public printStyle: string = `
  #temporaryOrder .details span {
    display: inline-block;
    width: 50px;
    margin: 0 10px;
  }

  #temporaryOrder .details {
      margin-bottom: 5px;
      font-size: 14px;
  }

  #temporaryOrder .publicName {
      text-align: center;
      margin: 10px 0px;
      letter-spacing: 15px;
  }

  #temporaryOrder .adviceName {
      font-size: 24px;
      font-weight: bold;
  }

  #temporaryOrder .docName {
      font-size: 20px;
  }

  #temporaryOrder .marginTop {
      margin-top: 10px;
  }

  #temporaryOrder .textCenter {
      text-align: center
  }

  #temporaryOrder .sickDetails {
      color: #000;
      margin-bottom: 9px;
      margin-top: -16px;
      font-size: 15px;
  }

  #temporaryOrder :host /deep/ .ant-modal-body {
      padding: 15px !important;
  }

  #temporaryOrder .detailsSice {
      display: inline-block;
      margin-left: 10%;
  }

  #temporaryOrder .first {
      width: 160px !important;
      /*这里需要自己调整，根据自己的需求调整宽度*/
      position: relative;
      overflow: hidden;
  }

  #temporaryOrder .xieLine {
      display: inline-block;
      position: absolute;
      top: -64px;
      left: 58px;
      height: 265px;
      width: 1px;
      background: #e8e8e8;
      -webkit-transform: rotate(42deg);
      transform: rotate(57deg);
  }

  #temporaryOrder .executiveSignature {
      position: absolute;
      top: 11px;
      left: 25px;
  }

  #temporaryOrder .signature {
      position: absolute;
      top: 79px;
      left: 72px;
  }

  #temporaryOrder .xieLineStop {
      display: inline-block;
      position: absolute;
      top: -87px;
      left: 100px;
      height: 214px;
      width: 1px;
      background: #e8e8e8;
      -webkit-transform: rotate(42deg);
      transform: rotate(72deg);
  }

  #temporaryOrder .executiveSignatureStop {
      position: absolute;
      top: 6px;
      left: 13px;
  }

  #temporaryOrder .signatureStop {
      position: absolute;
      top: 30px;
      left: 72px;
  }

  #temporaryOrder .borderTop {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-top: 1px solid #000;
      border-right: 1px solid #000;
  }

  #temporaryOrder .borderBottom {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
  }

  #temporaryOrder .borderOther {
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #000;
  }

  #temporaryOrder .marginLeft {
      margin-left: 1%;
      display: inline-block
  }

  #temporaryOrder .left {
      width: 100%;
      float: left
  }

  #temporaryOrder .right {
      display: inline-block;
      width: 25%;
      float: right;
      text-align: left;
  }

  #temporaryOrder .cusTable {
      border-collapse: collapse;
      border: 1px solid black !important;
  }

  #temporaryOrder .cusTable td,
  .cusTable th {
      border: 1px solid black !important;
      height: 30px !important;
      font-size:8pt;
  }


  /* 表格 */

  #temporaryOrder .tabRelative {
      position: relative;
  }

  #temporaryOrder .tabAbsolute {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      overflow: hidden !important;
      width: 100%;
      height: 100%;
  }

  #temporaryOrder .widthImg {
      height: 100%;
      width: 100%;
  }

  #temporaryOrder .poTop {
      position: absolute;
      top: 2px;
      left: 3px;
  }

  #temporaryOrder .lettSpan{
    display: inline-block;
      text-align: left;
  }

  #temporaryOrder .textLeft{
    text-align: left;
  }
  #temporaryOrder .borderC {
    border-bottom: 1px solid #000;
    padding: 2px 0;
    width: 100%;
    text-align: left;
    height: 26px;
    line-height: 24px;
  }

  #temporaryOrder .borderB {
    /* border-bottom: 1px solid #000; */
    padding: 2px 0;
    width: 100%;
    text-align: left;
    height: 26px;
    line-height: 24px;
  }
  #temporaryOrder .cusTable td.noBorder{
    border-top: 1px solid transparent !important;
    border-left: 1px solid transparent !important;
    border-right: 1px solid transparent !important;
  }
  #temporaryOrder .poBottom {
      position: absolute;
      bottom: 2px;
      right: 3px;
  }
  #temporaryOrder .borW {
    width: 100%;
  }
  `; //打印时的样式
  isVisible = false; //新增药品医嘱对话框
  tabIndex: any = "0"; //显示哪个医嘱
  isShowOldDialog = false; //选择药品弹出框
  unitList = []; //单位的列表
  usageList = []; //用法的列表
  frequencyList = []; //频次的列表
  nursingRoutineList = []; //护理常规
  notificationList = []; //病危或并重通知
  isolationList = []; //隔离种类
  foodTypeList = []; //饮食种类
  positionRequiresList = []; //体位要求
  examinationsList = []; //特殊检查和治疗
  drugAllList = []; //药品的列表
  specialList = []; // 特殊医嘱项目列表
  itemList = []; // 诊疗医嘱项目
  nursingList = []; //护理列表
  drugFrequencyList = []; //用药频次
  isDrugTableLoading = false; //药品列表加载
  isShow = true; //是否显示打印和显示全部按钮
  isShowDrug = false; //选择药房
  drugDisabled = false; //判断药库是否可选
  medRoomList = []; //获得药房列表
  sureLoading = false; //确认状态
  drugObj = {
    page: 1,
    size: 10,
    medRoomId: "", //药房id
    search: "", //药品名称或者拼音首字母或通用名
    accountId: "" //"账户Id"
  };
  drugPage = {
    total: 0,
    size: 10,
    index: 1
  };
  drugIndex; //添加药品列表的下标
  //嘱托医嘱
  asksObj = {
    saveAsks: "",
    tabIndex: ""
  };

  //诊疗医嘱
  diagnosisObj = {
    tabIndex: "", //第几个医嘱
    item: [], //项目
    itemStr: "", //项目显示的名字
    other: "" //其他
  };

  //特殊医嘱
  specialObj = {
    tabIndex: "", //第几个医嘱
    specialItem: "", //项目
    specialItemStr: "", //项目显示的名字
    other: "" //其他
  };

  // 护理医嘱
  nursObj = {
    routine: "", //护理常规
    routineName: "", //护理常规名字
    level: "", //护理级别
    levelName: "", //护理级别名字
    terminally: "", //病危
    terminallyName: "", //病危名字
    isolationType: "", //隔离种类
    isolationTypeName: "", //隔离种类名字
    foodType: "", //饮食种类
    foodTypeName: "", //饮食种类名字
    requires: "", //体位要求
    requiresName: "", //体位要求名字
    treatments: "", //特殊检查和治疗
    treatmentsName: "", //特殊检查和治疗名字
    isAccompany: true, //是否留陪
    peopleNum: 1, //几个人
    other: "", //其他
    tabIndex: "" //第几个医嘱
  };

  list = []; //列表
  orderList = []; //
  // 患者的基本信息
  patientsBasicInfo = {
    name: "", //名字
    sex: "", //性别
    age: "", //年龄
    bedName: "", //床号
    admissionNo: "", //住院号
    sectionOfficeName: "", //科室
    sickWardName: "", //病区
    attendingDoc: "" //主治医生
  };
  addState: any = "add"; //添加或删除标签
  index; //确定修改第几个
  // 西药医嘱的参数
  westernMedicine = {
    // 药品列表
    drugList: [
      {
        id: "", //药品的ID
        name: "", //药品的名称
        specification: "", //药品的规格
        dosage: 1, //药品的剂量
        unit: "", //药品的最小单位单位
        unitName: "", //药品的单位名字
        bigUnitNum: 1, //药品的总数量
        bigUnit: "", //药品的最大单位单位名字
        bigUnitName: "", //药品的最大单位单位名字
        medUsage: "", //用法
        usageName: "", //用法名称
        takeFrequency: [], //每次服药时间频次
        medFrequency: "", //用药频次
        medFrequencyName: "", //用药频次
        frequencyName: "" //频次名称
      }
    ],
    medRoomId: "", //药房ID
    medUsage: "", //用法
    usageName: "", //用法名称
    takeFrequency: [], //每次服药时间频次
    medFrequency: "", //用药频次
    medFrequencyName: "", //用药频次
    frequencyName: "", //频次名称
    other: "", //其他
    tabIndex: "" //第几个医嘱
  };
  user; //用户信息
  detailsAll; //获得所有的信息
  idStop; //每条要修改的ID
  // 获得医嘱列表
  detailsObj = {
    inHospitalInfoId: this.patientId,
    status: ""
  };

  systemInfo; //系统信息
  orderListIsVisabled = true; //未下达列表
  nullList = []; //当已下达列表和未下达列表都没有时显示
  drugLength = 0;
  sumLength = 0; //计算长度
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private modalService: NzModalService, //提示
    private actRoute: ActivatedRoute // 获取传递的参数
  ) {}

  ngOnInit() {
    this.nullList.length = 25;
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    if (this.inHospitalInfoId) this.patientId = this.inHospitalInfoId;
    if (typeof this.actRoute.snapshot.queryParams["data"] == "string") {
      this.patientId = JSON.parse(this.actRoute.snapshot.queryParams["data"])[
        "inHospitalInfo"
      ]["id"]; // 传递过来的参数
    }
    if (_.isString(this.patientId) && this.patientId.length > 0) {
      const reqObj: any = {};
      reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
      this.httpReq.post("med_record/list", null, reqObj, (data: any) => {
        if (data["code"] == 0) {
          const result = data["data"];
          //根据ID获得患者的个人信息
          this.patientsBasicInfo.name = result.inHospitalInfo.basicInfo.name;
          this.patientsBasicInfo.sex = result.inHospitalInfo.basicInfo.sex;
          this.patientsBasicInfo.age = result.inHospitalInfo.basicInfo.age;
          this.patientsBasicInfo.bedName = result.inHospitalInfo.bedName;
          this.patientsBasicInfo.attendingDoc =
            result.inHospitalInfo.attendingDoc;
          this.patientsBasicInfo.admissionNo =
            result.inHospitalInfo.admissionNo;
          this.patientsBasicInfo.sectionOfficeName =
            result.inHospitalInfo.sectionOffice.name;
          this.patientsBasicInfo.sickWardName =
            result.inHospitalInfo.sickWard.sickWardName;
        }
      });
    } else {
      this.message.error("未获取到老人ID");
    }
    // 获得账户信息ID
    this.user = this.localStorage.getUser();
    this.getAllDataDictionary();
    this.getListDetails();
    if (this.user.data.employees.personType == "0") {
      this.getNameList(); //获得医生下所有的病人的姓名
    }
  }

  nameList = []; //病人的姓名
  // 姓名下拉
  getNameList() {
    this.httpReq.post(
      "/long_term_orders/listOldManByDor",
      null,
      { accountId: this.user.data.id },
      data => {
        if (data["code"] == 0) {
          this.nameList = data["data"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  clickMe() {
    this.viewHeight = this.elementView;
  }
  // 显示新增医嘱对话框
  turnToAdd(state) {
    this.westernMedicine = {
      drugList: [
        {
          id: "", //药品的ID
          name: "", //药品的名称
          specification: "", //药品的规格
          dosage: 1, //药品的剂量
          unit: "", //药品的单位
          unitName: "", //药品的单位名字
          bigUnitNum: 1, //药品的总数量
          bigUnit: "", //药品的最大单位单位名字
          bigUnitName: "", //药品的最大单位单位名字
          medUsage: "", //用法
          usageName: "", //用法名称
          takeFrequency: [], //每次服药时间频次
          medFrequency: "", //用药频次
          medFrequencyName: "", //用药频次
          frequencyName: "" //频次名称
        }
      ],
      medRoomId: "", //药房ID
      medUsage: "", //用法
      usageName: "", //用法名称
      takeFrequency: [], //每次服药时间频次
      medFrequency: "", //用药频次
      medFrequencyName: "", //用药频次
      frequencyName: "", //频次名称
      other: "", //其他
      tabIndex: "" //第几个医嘱
    };

    //诊疗医嘱
    this.diagnosisObj = {
      tabIndex: "", //第几个医嘱
      item: [], //项目
      itemStr: "", //项目显示的名字
      other: "" //其他
    };

    //嘱托医嘱
    this.asksObj = {
      saveAsks: "",
      tabIndex: ""
    };
    //特殊医嘱
    this.specialObj = {
      tabIndex: "", //第几个医嘱
      specialItem: "", //项目
      specialItemStr: "", //项目显示的名字
      other: "" //其他
    };
    //护理医嘱
    this.nursObj = {
      routine: "", //护理常规
      routineName: "", //护理常规名字
      level: "", //护理级别
      levelName: "", //护理级别名字
      terminally: "", //病危
      terminallyName: "", //病危名字
      isolationType: "", //隔离种类
      isolationTypeName: "", //隔离种类名字
      foodType: "", //饮食种类
      foodTypeName: "", //饮食种类名字
      requires: "", //体位要求
      requiresName: "", //体位要求名字
      treatments: "", //特殊检查和治疗
      treatmentsName: "", //特殊检查和治疗名字
      isAccompany: true, //是否留陪
      peopleNum: 1, //几个人
      other: "", //其他
      tabIndex: "" //第几个医嘱
    };

    this.tabIndex = "0";
    this.addState = state;
    this.isVisible = true;
    this.disabled = false;
    this.drugDisabled = false;
  }

  disabled = false;

  //返回
  back() {
    history.back();
  }

  // 添加药品
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    // 获得药房
    this.getMedRoomListAll();
    if (this.medRoomList.length == 1) {
      this.isShowDrug = false;
    }
    // 弹出药品列表
    this.isShowOldDialog = true;
  }

  // 打印开始
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.isShow = false; //不显示新增临时医嘱、打印、医生或者护士状态、查询按钮
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isShow = true;
  }

  // 没有下达医嘱之前的确认保存医嘱
  saveWesternMedicine() {
    const obj = {
      beginDate: "", //日期
      beginTime: "", //时间
      orderDetail: "", //字符串对象可以作为回显和确认下达的时候传参数
      orderSum: "", //字符串  只能作为显示再页面上拼接的字符串
      html: "",
      html1: "",
      accountId: "", //登录者id
      doctorName: "", //医生名字
      tabIndex: "", //
      state: "6", //状态
      orderType: "", //医嘱类型
      objArr: []
    };
    obj.beginDate = this.getDateTime().date; //获得当前的日期和时间；
    obj.beginTime = this.getDateTime().time; //获得当前的日期和时间；
    obj.accountId = this.user.data.id; //当前登录用户的id
    obj.doctorName = this.user.data.name; //当前登录用户的名字
    this.sureLoading = true; //确认的状态
    if (this.tabIndex == "2") {
      this.drugLength += this.westernMedicine.drugList.length; //获得添加的药品有几个  新加
      //如果医嘱是西药医嘱
      if (
        //如果药品的数组长度小于0或者长度大于0并且id为空时
        this.westernMedicine.drugList.length <= 0 ||
        (this.westernMedicine.drugList.length >= 1 &&
          this.westernMedicine.drugList[0].id == "")
      ) {
        this.message.error("请选择药品");
        this.sureLoading = false;
        return;
      }
      this.westernMedicine.tabIndex = this.tabIndex;
      obj.tabIndex = this.tabIndex;
      obj.orderSum = "";
      let str = "";
      let adviceHtml = "";
      let adviceHtml1 = "";

      for (
        let index = 0;
        index < this.westernMedicine.drugList.length;
        index++
      ) {
        const e = this.westernMedicine.drugList[index];
        const lastLength = this.westernMedicine.drugList.length - 1;
        let classStr = "";
        e.usageName = e.usageName.split("-")[0];
        e.frequencyName = e.frequencyName;
        e.medFrequencyName = e.medFrequencyName.split("-")[0];
        //根据判断药品的第几个数据 显示后面时什么样式
        if (index == 0 && this.westernMedicine.drugList.length > 1) {
          //如果时第一个
          // classStr = "borderTop";
          classStr =
            "display: inline-block; width: 10px;height: 10px; border-top: 1px solid #000;border-right: 1px solid #000;";
        } else if (
          index == lastLength &&
          this.westernMedicine.drugList.length > 1
        ) {
          //如果时第中间的
          // classStr = "borderBottom";
          classStr =
            " display: inline-block; width: 10px; height: 10px;border-bottom: 1px solid #000;border-right: 1px solid #000;";
        } else if (this.westernMedicine.drugList.length == 1) {
          //如果就一个数据，后面的符号不显示
          classStr = "";
        } else {
          //如果时最后一个
          classStr =
            " display: inline-block; width: 10px; height: 10px;border-right: 1px solid #000;";
        }

        const name = e.name.split("（")[0];
        str += `药品名称:${name}     药品规格：${e.specification}   药品剂量：${e.dosage}  药品单位：${e.unitName}`;

        // 拼接成页面显示的数据

        if (index == 0) {
          adviceHtml += `
          <div style="position: relative; width:100%;text-align: left;height: 30px; line-height: 30px;">
              <span>${name}${e.specification}
              </span>
              <span style="position: absolute;right: 1%;    top: 0px;display: inline-block;">
                  <span>${e.dosage}${e.unitName}${e.usageName}${e.frequencyName}${e.medFrequencyName}</span>
                  <span  style="${classStr}"></span> <br>
              </span>
        </div>`;
        } else {
          adviceHtml += `
          <div style="position: relative; width:100%;text-align: left;border-top: 1px solid #000;    height: 30px;line-height: 30px;">
              <span>${name}${e.specification}
              </span>
              <span style="position: absolute;right: 1%;    top: 0px;display: inline-block;">
                  <span>${e.dosage}${e.unitName}${e.usageName}${e.frequencyName}${e.medFrequencyName}</span>
                  <span  style="${classStr}"></span> <br>
              </span>
        </div>`;
        }
      }

      obj.orderSum = `${str}用法：${this.westernMedicine.usageName}   频次：${this.westernMedicine.frequencyName}     其他：${this.westernMedicine.other} `;

      obj.html = adviceHtml;
      obj.html1 = adviceHtml1;
      obj.orderType = this.tabIndex;
      if (this.medRoomList.length > 0) {
        this.westernMedicine.medRoomId = this.medRoomList[0].id;
      }

      obj.orderDetail = JSON.stringify(this.westernMedicine);
      this.sureLoading = false;
    } else if (this.tabIndex == "1") {
      //如果是嘱托医嘱
      this.asksObj.tabIndex = this.tabIndex;
      obj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.asksObj);
      obj.orderSum = this.asksObj.saveAsks;
      this.sureLoading = false;

      // 新加  每页显示个数一样
      obj.objArr = [];
      for (let index = 0; index < 100000; index = index + 17) {
        const str = obj.orderSum.slice(index, index + 17);
        if (str != "") {
          obj.objArr.push(str);
        } else {
          this.isVisible = false;
          this.sureLoading = false;
        }
      }

      this.drugLength += obj.objArr.length; //获得添加的药品有几个
    } else if (this.tabIndex == "3") {
      //如果是诊疗医嘱
      this.diagnosisObj.tabIndex = this.tabIndex;
      obj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.diagnosisObj);
      obj.orderSum = this.diagnosisObj.itemStr + this.diagnosisObj.other;
      // this.sureLoading = false;

      // 新加  每页显示个数一样
      obj.objArr = [];
      for (let index = 0; index < 100000; index = index + 17) {
        const str = obj.orderSum.slice(index, index + 17);
        if (str != "") {
          obj.objArr.push(str);
        } else {
          this.isVisible = false;
          this.sureLoading = false;
        }
      }
      this.drugLength += obj.objArr.length; //获得添加的药品有几个
    } else if (this.tabIndex == "4") {
      //如果是特殊医嘱
      this.specialObj.tabIndex = this.tabIndex;
      obj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.specialObj);
      obj.orderSum = this.specialObj.specialItemStr + this.specialObj.other;
      // 新加  每页显示个数一样
      obj.objArr = [];
      for (let index = 0; index < 100000; index = index + 17) {
        const str = obj.orderSum.slice(index, index + 17);
        if (str != "") {
          obj.objArr.push(str);
        } else {
          this.isVisible = false;
          this.sureLoading = false;
        }
      }
      this.drugLength += obj.objArr.length; //获得添加的药品有几个
    } else if (this.tabIndex == "0") {
      //如果是护理医嘱
      this.nursObj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.nursObj);
      const sum =
        this.nursObj.routineName +
        this.nursObj.levelName +
        this.nursObj.terminallyName +
        this.nursObj.isolationTypeName +
        this.nursObj.foodTypeName +
        this.nursObj.requiresName +
        this.nursObj.treatmentsName;
      obj.orderSum = sum;
      // 新加  每页显示个数一样
      obj.objArr = [];
      for (let index = 0; index < 100000; index = index + 17) {
        const str = obj.orderSum.slice(index, index + 17);
        if (str != "") {
          obj.objArr.push(str);
        } else {
          this.isVisible = false;
          this.sureLoading = false;
        }
      }
      this.drugLength += obj.objArr.length; //获得添加的药品有几个
    } else {
    }

    if (this.addState == "edit") {
      //如果是修改的，就根据数组修改数据
      this.orderList.splice(this.index, 1, obj);
    } else {
      //如果是添加的，就根据数据添加到数组中
      this.orderList.push(obj);
    }

    // 新加 获得空格的个数
    this.nullList.length = 22 - ((this.drugLength + this.sumLength) % 22);

    this.isVisible = false;
  }

  // 确认下达
  confirmOrder() {
    this.sureLoading = true;

    const obj = {
      tempOrdersId: "", //"临时医嘱Id",
      inHospitalInfoId: "", //"入院信息Id",
      beginDate: "", //"起始日期",
      beginTime: "", //"起始时间",
      orderType: "", //"医嘱类型0护理1嘱托2西药3诊疗4特殊",
      orderSum: "", //"医嘱概述",
      orderDetail: "", //"医嘱细节",
      dorSign: "", //"医生签名",
      html: "",
      html1: "",
      accountId: "" //"登陆账户Id"
    };

    obj.inHospitalInfoId = this.patientId;
    obj.accountId = this.user.data.id;
    obj.beginDate = this.detailsAll.beginDate;
    obj.beginTime = this.detailsAll.beginTime;
    obj.orderSum = this.detailsAll.orderSum;
    obj.orderDetail = this.detailsAll.orderDetail;
    // obj.dorSign = this.detailsAll.doctorName;
    obj.html = this.detailsAll.html;
    obj.html1 = this.detailsAll.html1;
    // 根据选择的医嘱改变index值
    obj.orderType = this.tabIndex;
    obj.dorSign = this.user.data.name;
    // 下达医嘱
    this.httpReq.post("temp_orders/saveOrUpdate", null, obj, data => {
      this.isVisible = false;
      this.isDrugTableLoading = false;
      this.sureLoading = false;
      if (data["code"] == 0) {
        this.message.success("下达成功");
        this.orderList.splice(this.index, 1);
        this.getListDetails();
      }
    });
  }
  tempOrdersId = ""; //临时医嘱ID
  // 下达医嘱之后，药品未发之前医生可以编辑
  doctEdit(data) {
    this.isVisible = true;
    this.disabled = false;
    this.tempOrdersId = data.id; //保存临时医嘱的ID
    this.addState = "dacoEdit"; //医生修改的状态

    const details = JSON.parse(data.orderDetail);
    this.tabIndex = details.tabIndex;
    // 如果修改的是0，护理医嘱
    if (data.orderType == "0") {
      this.nursObj = details;
    } else if (data.orderType == "1") {
      this.asksObj = details;
    } else if (data.orderType == "2") {
      this.westernMedicine = details;
    } else if (data.orderType == "3") {
      this.diagnosisObj = details;
    } else if (data.orderType == "4") {
      this.specialObj = details;
    }
  }

  // 添加到数据库的数据，确认修改数据之后的保存
  editDoctor() {
    const obj = {
      tempOrdersId: "", //"临时医嘱Id",
      inHospitalInfoId: "", //"入院信息Id",
      beginDate: "", //日期
      beginTime: "", //时间
      orderDetail: "", //字符串对象可以作为回显和确认下达的时候传参数
      orderSum: "", //字符串  只能作为显示再页面上拼接的字符串
      html: "",
      html1: "",
      accountId: "", //登录者id
      doctorName: "", //医生名字
      tabIndex: "", //
      state: "6", //状态
      orderType: "", //医嘱类型
      dorSign: "", //医生签字
      objArr: []
    };
    obj.inHospitalInfoId = this.patientId;
    obj.tempOrdersId = this.tempOrdersId;
    obj.beginDate = this.getDateTime().date; //获得当前的日期和时间；
    obj.beginTime = this.getDateTime().time; //获得当前的日期和时间；
    obj.accountId = this.user.data.id; //当前登录用户的id
    obj.doctorName = this.user.data.name; //当前登录用户的名字
    obj.orderType = this.tabIndex; //医嘱类型0护理1嘱托2西药3诊疗4特殊
    obj.dorSign = this.user.data.name;
    if (this.tabIndex == "0") {
      //如果是护理医嘱
      this.nursObj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.nursObj);
      const sum =
        this.nursObj.routineName +
        this.nursObj.levelName +
        this.nursObj.terminallyName +
        this.nursObj.isolationTypeName +
        this.nursObj.foodTypeName +
        this.nursObj.requiresName +
        this.nursObj.treatmentsName;
      obj.orderSum = sum;
    } else if (this.tabIndex == "1") {
      obj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.asksObj);
      obj.orderSum = this.asksObj.saveAsks;
    } else if (this.tabIndex == "2") {
      this.westernMedicine.tabIndex = this.tabIndex;
      obj.tabIndex = this.tabIndex;
      obj.orderSum = "";
      let str = "";
      let adviceHtml = "";
      let adviceHtml1 = "";

      for (
        let index = 0;
        index < this.westernMedicine.drugList.length;
        index++
      ) {
        const e = this.westernMedicine.drugList[index];
        const lastLength = this.westernMedicine.drugList.length - 1;
        let classStr = "";
        e.usageName = e.usageName.split("-")[0];
        e.frequencyName = e.frequencyName;
        e.medFrequencyName = e.medFrequencyName.split("-")[0];
        //根据判断药品的第几个数据 显示后面时什么样式
        if (index == 0 && this.westernMedicine.drugList.length > 1) {
          //如果时第一个
          // classStr = "borderTop";
          classStr =
            "display: inline-block; width: 10px;height: 10px; border-top: 1px solid #000;border-right: 1px solid #000;";
        } else if (
          index == lastLength &&
          this.westernMedicine.drugList.length > 1
        ) {
          //如果时第中间的
          // classStr = "borderBottom";
          classStr =
            " display: inline-block; width: 10px; height: 10px;border-bottom: 1px solid #000;border-right: 1px solid #000;";
        } else if (this.westernMedicine.drugList.length == 1) {
          //如果就一个数据，后面的符号不显示
          classStr = "";
        } else {
          //如果时最后一个
          // classStr = "borderOther";

          classStr =
            " display: inline-block; width: 10px; height: 10px;border-right: 1px solid #000;";
        }

        const name = e.name.split("（")[0];
        str += `药品名称:${name}     药品规格：${e.specification}   药品剂量：${e.dosage}  药品单位：${e.unitName}`;

        // 拼接成页面显示的数据

        if (index == 0) {
          adviceHtml += `
          <div style="position: relative; width:100%;text-align: left;height: 30px; line-height: 30px;">
              <span>${name}${e.specification}
              </span>
              <span style="position: absolute;right: 1%;    top: 0px;display: inline-block;">
                  <span>${e.dosage}${e.unitName}${e.usageName}${e.frequencyName}${e.medFrequencyName}</span>
                  <span  style="${classStr}"></span> <br>
              </span>
        </div>`;
        } else {
          adviceHtml += `
          <div style="position: relative; width:100%;text-align: left;border-top: 1px solid #000;    height: 30px;line-height: 30px;">
              <span>${name}${e.specification}
              </span>
              <span style="position: absolute;right: 1%;    top: 0px;display: inline-block;">
                  <span>${e.dosage}${e.unitName}${e.usageName}${e.frequencyName}${e.medFrequencyName}</span>
                  <span  style="${classStr}"></span> <br>
              </span>
        </div>`;
        }
      }

      obj.orderSum = `${str}用法：${this.westernMedicine.usageName}   频次：${this.westernMedicine.frequencyName}     其他：${this.westernMedicine.other} `;

      obj.html = adviceHtml;
      obj.html1 = adviceHtml1;
      obj.orderType = this.tabIndex;

      this.getMedRoomListAll();
      if (this.medRoomList.length > 0) {
        this.westernMedicine.medRoomId = this.medRoomList[0].id;
      }

      obj.orderDetail = JSON.stringify(this.westernMedicine);
    } else if (this.tabIndex == "3") {
      obj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.diagnosisObj);
      obj.orderSum = this.diagnosisObj.itemStr + this.diagnosisObj.other;
    } else if (this.tabIndex == "4") {
      obj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.specialObj);
      obj.orderSum = this.specialObj.specialItemStr + this.specialObj.other;
    }

    // 下达医嘱
    this.httpReq.post("temp_orders/saveOrUpdate", null, obj, data => {
      this.isVisible = false;
      this.isDrugTableLoading = false;
      this.sureLoading = false;
      if (data["code"] == 0) {
        this.message.success("修改成功");
        this.orderList.splice(this.index, 1);
        this.getListDetails();
      }
    });
  }
  // 编辑
  edit(state, data, i) {
    const result = JSON.parse(data.orderDetail);
    this.index = i;
    this.addState = state;
    this.disabled = false;
    this.detailsAll = data;

    this.tabIndex = result.tabIndex;
    //smitState下达，stop停止，toPerform待执行
    if (state == "smitState" || state == "stop" || state == "toPerform") {
      this.disabled = true;
    }

    if (state == "toPerform") {
      this.idStop = data.id;
    }

    if (result.tabIndex == "2") {
      //修改西药医嘱
      this.westernMedicine = result;
      this.westernMedicine.drugList = result.drugList;
      const details = JSON.parse(data.orderDetail).drugList;
      this.drugLength = this.drugLength - details.length;
    } else if (result.tabIndex == "1") {
      //修改嘱托医嘱
      this.asksObj.tabIndex = result.tabIndex;
      this.asksObj.saveAsks = result.saveAsks;
      this.drugLength = this.drugLength - data.objArr.length;
    } else if (result.tabIndex == "3") {
      //修改诊疗医嘱
      this.diagnosisObj.tabIndex = result.tabIndex;
      this.diagnosisObj.item = result.item;
      this.diagnosisObj.other = result.other;
      this.drugLength = this.drugLength - data.objArr.length;
    } else if (result.tabIndex == "4") {
      //修改特殊医嘱
      this.specialObj.tabIndex = result.tabIndex;
      this.specialObj.specialItem = result.specialItem;
      this.specialObj.other = result.other;
      this.drugLength = this.drugLength - data.objArr.length;
    } else if (result.tabIndex == "0") {
      // 护理医嘱
      this.nursObj = result;
      this.drugLength = this.drugLength - data.objArr.length;
    }
    this.isVisible = true;
  }
  deleteSum = 0; //删除的条数
  // 删除列表中的数据
  delete(data, i) {
    const details = JSON.parse(data.orderDetail).drugList;
    this.globalService.delModal(() => {
      this.orderList.splice(i, 1);

      if (details == undefined) {
        this.deleteSum += data.objArr.length;
      } else {
        this.deleteSum += details.length;
      }

      this.nullList.length =
        22 - ((this.drugLength + this.sumLength - this.deleteSum) % 22);
    });
  }

  // 获得当前的日期和时间
  getDateTime() {
    // 获得今天得日期
    const data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate();
    let hours = data.getHours(); //获取当前小时数(0-23)
    let minutes = data.getMinutes(); //获取当前分钟数(0-59)
    let monthStr;
    let dayStr;
    let hoursStr;
    let minutesStr;
    if (month < 10) {
      monthStr = "0" + month;
    } else {
      monthStr = "" + month;
    }
    if (day < 10) {
      dayStr = "0" + day;
    } else {
      dayStr = "" + day;
    }
    if (hours < 10) {
      hoursStr = "0" + hours;
    } else {
      hoursStr = hours;
    }

    if (minutes < 10) {
      minutesStr = "0" + minutes;
    } else {
      minutesStr = minutes;
    }
    const fullYear = year + "-" + monthStr + "-" + dayStr;
    const date = fullYear; //当前的日期
    const time = hoursStr + ":" + minutesStr; // 获得当前时间
    return { date: date, time: time };
  }

  // 选择单位
  changUnitName(i) {
    for (let index = 0; index < this.unitList.length; index++) {
      const e = this.unitList[index];
      if (e.dictValue == this.westernMedicine.drugList[i].unit) {
        this.westernMedicine.drugList[i].unitName = e.dictTag;
        return;
      }
    }
  }

  // 选择用法
  changUsageName(i) {
    for (let index = 0; index < this.usageList.length; index++) {
      const e = this.usageList[index];
      if (e.dictValue == this.westernMedicine.drugList[i].medUsage) {
        this.westernMedicine.drugList[i].usageName = e.dictTag;
        return;
      }
    }
  }

  // 选择频次
  changFrequencyName(c) {
    this.westernMedicine.drugList[c].frequencyName = "";
    for (
      let i = 0;
      i < this.westernMedicine.drugList[c].takeFrequency.length;
      i++
    ) {
      const iName = this.westernMedicine.drugList[c].takeFrequency[i];
      for (let index = 0; index < this.frequencyList.length; index++) {
        const e = this.frequencyList[index];
        if (iName == e.dictValue) {
          const dictTag = e.dictTag.split("-")[0];
          this.westernMedicine.drugList[c].frequencyName += dictTag + ",";
        }
      }
    }
  }

  // 获得诊疗医嘱
  changItemName() {
    this.diagnosisObj.itemStr = "";
    for (let i = 0; i < this.diagnosisObj.item.length; i++) {
      const iName = this.diagnosisObj.item[i];
      for (let index = 0; index < this.itemList.length; index++) {
        const e = this.itemList[index];
        if (iName == e.dictValue) {
          this.diagnosisObj.itemStr += e.dictTag;
        }
      }
    }
  }
  // 获得特殊医嘱
  changSpecialItemName() {
    for (let index = 0; index < this.specialList.length; index++) {
      const e = this.specialList[index];
      if (e.dictValue == this.specialObj.specialItem) {
        this.specialObj.specialItemStr = e.dictTag;
        return;
      }
    }
  }

  // 获得用药频次名字
  changDrugFrequency(i) {
    for (let index = 0; index < this.drugFrequencyList.length; index++) {
      const e = this.drugFrequencyList[index];
      if (e.dictValue == this.westernMedicine.drugList[i].medFrequency) {
        this.westernMedicine.drugList[i].medFrequencyName = e.dictTag;
        return;
      }
    }
  }

  // 获得数据词典中的值
  getAllDataDictionary() {
    const that = this;
    this.httpReq.post(
      "/dictionaryMedicationData/dataListAllTwo",
      null,
      {
        dictTypes:
          "unit,usage,frequency,nursRoutine,notification,isolation,foodType,positionRequires,examinations,drugFrequency,careOfLevel,specialDoctorAdvice,diagnosisDoctorAdvice"
      },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const info = data["data"];
            info.forEach(e => {
              //诊疗医嘱项目
              if (e.dictType == "diagnosisDoctorAdvice") {
                this.itemList = e.ddList;
              }
              //特殊医嘱项目列表
              if (e.dictType == "specialDoctorAdvice") {
                this.specialList = e.ddList;
              }
              //护理列表
              if (e.dictType == "careOfLevel") {
                this.nursingList = e.ddList;
              }
              //单位
              if (e.dictType == "unit") {
                this.unitList = e.ddList;
              }
              //用法
              if (e.dictType == "usage") {
                this.usageList = e.ddList;
              }
              //频次
              if (e.dictType == "frequency") {
                this.frequencyList = e.ddList;
              }
              //护理常规
              if (e.dictType == "nursRoutine") {
                this.nursingRoutineList = e.ddList;
              }
              //病危或并重通知
              if (e.dictType == "notification") {
                this.notificationList = e.ddList;
              }
              //隔离种类
              if (e.dictType == "isolation") {
                this.isolationList = e.ddList;
              }
              //饮食种类
              if (e.dictType == "foodType") {
                this.foodTypeList = e.ddList;
              }
              //体位要求
              if (e.dictType == "positionRequires") {
                this.positionRequiresList = e.ddList;
              }
              //特殊检查和治疗
              if (e.dictType == "examinations") {
                this.examinationsList = e.ddList;
              }
              //用药频次
              if (e.dictType == "drugFrequency") {
                this.drugFrequencyList = e.ddList;
              }
            });
          } else {
            that.message.success(data["message"]);
          }
        }
      }
    );
  }

  // 选择药品
  changeDrug(index) {
    this.drugIndex = index;

    let flag = true;

    //判断是显示选择药房还是选择药
    for (let index = 0; index < this.westernMedicine.drugList.length; index++) {
      const element = this.westernMedicine.drugList[index];
      if (element.name != "") {
        // 当列表中有一个药时就不用显示药房
        flag = false;
      }
    }

    if (flag == true) {
      this.isShowDrug = true;
    } else {
      this.isShowOldDialog = true;
      this.getDrugAllList();
    }

    this.drugObj.search = "";
    this.getMedRoomListAll();
  }

  //删除药品
  deleteDrug(i) {
    this.globalService.delModal(() => {
      this.westernMedicine.drugList.splice(i, 1);
    });
  }
  // 选择药房之后 显示列表
  changeMedRoom() {
    this.isShowDrug = false;
    if (this.drugObj.medRoomId == "") {
      this.message.error("请选择药房");
    } else {
      this.isShowOldDialog = true;
      this.getDrugAllList();
    }
  }

  // 获得药房列表
  getMedRoomListAll() {
    this.httpReq.post("/med_room/listAll", null, {}, data => {
      if (data["code"] == 0) {
        this.medRoomList = data["data"];
        //默认药房为第一个
        if (this.medRoomList.length > 0) {
          this.drugObj.medRoomId = this.medRoomList[0].id;
          this.getDrugAllList();
        }
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 获得药品的列表
  getDrugAllList(reset: boolean = false): void {
    if (reset) {
      this.drugPage.index = 1;
    }
    this.drugObj.page = this.drugPage.index - 1;
    this.drugObj.size = this.drugPage.size;
    this.drugObj.accountId = this.user.data.id;
    this.isDrugTableLoading = true;
    this.httpReq.post("med_drug/listAllForDor", null, this.drugObj, data => {
      this.isDrugTableLoading = false;
      if (data["code"] == 0) {
        this.drugAllList = data["data"]["list"];
        this.drugPage.total = data["data"]["totalElements"];
      }
    });
  }

  // 选择药品的时候
  chooseDrug(data) {
    let disabled = true;
    for (let i = 0; i < this.westernMedicine.drugList.length; i++) {
      if (this.westernMedicine.drugList[i].id == data.medDrug.id) {
        this.message.error("已经添加过此药品");
        disabled = false;
        return;
      }
    }

    if (disabled == true) {
      // 如果当前药品数组只有一个并且第一个的id为空，就直接添加数据
      if (
        this.westernMedicine.drugList.length == 1 &&
        this.westernMedicine.drugList[this.westernMedicine.drugList.length - 1]
          .id == ""
      ) {
        const wesEle = this.westernMedicine.drugList[
          this.westernMedicine.drugList.length - 1
        ];
        wesEle.id = data.medDrug.id;
        wesEle.name = data.medDrug.drugName;
        wesEle.specification = data.medDrug.specification;
        wesEle.bigUnit = data.medDrug.largePackingUnit;
        this.drugDisabled = true;
        // this.isShowOldDialog = false;
        for (let index = 0; index < this.unitList.length; index++) {
          const e = this.unitList[index];
          if (data.medDrug.minPackingUnit == e.dictValue) {
            wesEle.unit = e.dictValue;
            wesEle.unitName = e.dictTag;
            return;
          }
        }

        for (let index = 0; index < this.unitList.length; index++) {
          const e = this.unitList[index];
          if (data.medDrug.largePackingUnit == e.dictValue) {
            wesEle.bigUnitName = e.dictTag;
            return;
          }
        }
      } else {
        //如果药品数组第一个ID不为空，就给药品数组添加一个并且赋值
        const id =
          this.westernMedicine.drugList.length > 0
            ? this.westernMedicine.drugList[
                this.westernMedicine.drugList.length - 1
              ].id + 1
            : 0;

        const jiatingchengyuan = {
          id: "", //药品的id
          name: "", //药品的名字
          specification: "", ////药品的规格
          dosage: 1, //药品的剂量
          unit: "", //药品的单位
          unitName: "", //药品的单位名字
          bigUnitNum: 1, //药品的总数量
          bigUnit: "", //药品的最大单位单位名字
          bigUnitName: "", //药品的最大单位单位名字
          medUsage: "", //用法
          usageName: "", //用法名称
          takeFrequency: [], //每次服药时间频次
          medFrequency: "", //用药频次
          medFrequencyName: "", //用药频次
          frequencyName: "" //频次名称
        };

        this.westernMedicine.drugList = [
          ...this.westernMedicine.drugList,
          jiatingchengyuan
        ];

        const wesEle = this.westernMedicine.drugList[
          this.westernMedicine.drugList.length - 1
        ];
        wesEle.id = data.medDrug.id;
        wesEle.name = data.medDrug.drugName;
        wesEle.specification = data.medDrug.specification;
        wesEle.bigUnit = data.medDrug.largePackingUnit;
        this.drugDisabled = true;
        // this.isShowOldDialog = false;
        for (let index = 0; index < this.unitList.length; index++) {
          const e = this.unitList[index];
          if (data.medDrug.minPackingUnit == e.dictValue) {
            wesEle.unit = e.dictValue;
            wesEle.unitName = e.dictTag;
            return;
          }
        }

        for (let index = 0; index < this.unitList.length; index++) {
          const e = this.unitList[index];
          if (data.medDrug.largePackingUnit == e.dictValue) {
            wesEle.bigUnitName = e.dictTag;
            return;
          }
        }
      }
    }
  }

  getListDetails() {
    this.detailsObj.inHospitalInfoId = this.patientId;
    if (this.detailsObj.status == "" || this.detailsObj.status == null) {
      this.orderListIsVisabled = true;
    } else {
      this.orderListIsVisabled = false;
    }
    this.httpReq.post("/temp_orders/listAll", null, this.detailsObj, data => {
      this.isDrugTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"];
        // 判断如果list的长度大于0  循环list  如果状态不是医药医嘱  然后截取ordersum字符串  变成数组
        if (this.list.length > 0) {
          for (let index = 0; index < this.list.length; index++) {
            const e = this.list[index];
            if (e.orderType != 2) {
              const objArr = [];
              const objArr1 = [];
              for (let index = 0; index < 100000; index = index + 17) {
                const str = e.orderSum.slice(index, index + 17);
                if (str != "") {
                  objArr.push(str);
                } else {
                  objArr1.push(str);
                }
              }
              e.objArr = objArr;
              this.sumLength += objArr.length; //判断请求的list里面的有几个长度
            } else {
              this.sumLength += JSON.parse(e.orderDetail).drugList.length;
            }
          }
          //每页是22行  去掉list里面的数据 如果LIST里面的数据长度大于22  就取余
          this.nullList.length = 22 - (this.sumLength % 22);
        }
      }
    });
  }

  // 临时医嘱护士待确认
  sendConfirmed() {
    const obj = {
      tempOrdersId: "", //"长期医嘱Id",
      accountId: "" //"登陆账户Id"
    };

    obj.tempOrdersId = this.idStop;
    obj.accountId = this.user.data.id;
    this.isVisible = true;
    this.sureLoading = true;
    this.modalService.confirm({
      nzTitle: "是否确认医嘱?",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        this.httpReq.post("/temp_orders/confirm", null, obj, data => {
          this.isDrugTableLoading = false;
          this.isVisible = false;
          this.sureLoading = false;
          if (data["code"] == 0) {
            this.message.success("医嘱执行成功");

            this.getListDetails();
          } else {
            this.message.error(data["message"]);
          }
        });
      },
      nzCancelText: "取消",
      nzOnCancel: () => {
        this.sureLoading = false;
      }
    });
  }

  // 长期医嘱护士待审核
  toAudit(data) {
    const obj = {
      longTermOrdersId: "", //"长期医嘱Id",
      status: "0", //"审核状态:0审核下达1审核停止",
      accountId: "" //"登陆账户Id"
    };
    if (data.sunStatus == "1") {
      obj.status = "0";
    } else {
      obj.status = "1";
    }
    obj.longTermOrdersId = data.id;
    obj.accountId = this.user.data.id;
    this.httpReq.post("/long_term_orders/check", null, obj, data => {
      this.isDrugTableLoading = false;
      if (data["code"] == 0) {
        this.message.success("医嘱审核成功");
        this.getListDetails();
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 长期医嘱下达停止操作
  stopAdvice(data) {
    const obj = {
      longTermOrdersId: "", //"长期医嘱Id",
      endDate: "", //结束日期
      endTime: "", //结束时间
      accountId: "" //"登陆账户Id"
    };

    obj.longTermOrdersId = data.id;
    obj.accountId = this.user.data.id;
    obj.endDate = this.getDateTime().date;
    obj.endTime = this.getDateTime().time;
    this.modalService.confirm({
      nzTitle: "请确认是否停止医嘱?",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        this.httpReq.post("/long_term_orders/stop", null, obj, data => {
          this.isDrugTableLoading = false;
          if (data["code"] == 0) {
            this.message.success("停止医嘱成功");
            this.getListDetails();
          } else {
            this.message.error(data["message"]);
          }
        });
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }

  // 获取护理医嘱的名字
  changRoutineName(value) {
    // value判断，0是护理常规，1是护理级别，2病危或并重通知，3隔离种类，4饮食种类，5体位要求，6特殊检查和治疗，
    if (value == "0") {
      for (let index = 0; index < this.nursingRoutineList.length; index++) {
        const e = this.nursingRoutineList[index];
        if (e.dictValue == this.nursObj.routine) {
          this.nursObj.routineName = e.dictTag;
          return;
        }
      }
    } else if (value == "1") {
      for (let index = 0; index < this.nursingList.length; index++) {
        const e = this.nursingList[index];
        if (e.dictValue == this.nursObj.level) {
          this.nursObj.levelName = e.dictTag;
          return;
        }
      }
    } else if (value == "2") {
      for (let index = 0; index < this.notificationList.length; index++) {
        const e = this.notificationList[index];
        if (e.dictValue == this.nursObj.terminally) {
          this.nursObj.terminallyName = e.dictTag;
          return;
        }
      }
    } else if (value == "3") {
      for (let index = 0; index < this.isolationList.length; index++) {
        const e = this.isolationList[index];
        if (e.dictValue == this.nursObj.isolationType) {
          this.nursObj.isolationTypeName = e.dictTag;
          return;
        }
      }
    } else if (value == "4") {
      for (let index = 0; index < this.foodTypeList.length; index++) {
        const e = this.foodTypeList[index];
        if (e.dictValue == this.nursObj.foodType) {
          this.nursObj.foodTypeName = e.dictTag;
          return;
        }
      }
    } else if (value == "5") {
      for (let index = 0; index < this.positionRequiresList.length; index++) {
        const e = this.positionRequiresList[index];
        if (e.dictValue == this.nursObj.requires) {
          this.nursObj.requiresName = e.dictTag;
          return;
        }
      }
    } else if (value == "6") {
      for (let index = 0; index < this.examinationsList.length; index++) {
        const e = this.examinationsList[index];
        if (e.dictValue == this.nursObj.treatments) {
          this.nursObj.treatmentsName = e.dictTag;
          return;
        }
      }
    }
  }

  // 判断是否是否需要人
  getIsAccompany() {
    this.nursObj.isAccompany = !this.nursObj.isAccompany;
  }

  historyAdviceObj = {
    name: "", //"病人姓名或住院号",
    orderType: "", //"医嘱类型0护理1嘱托2西药3诊疗4特殊(默认为2西药医嘱)",
    accountId: "", //"登陆账户Id"
    page: 0,
    size: 10
  };
  historyAdviceList = []; //历史医嘱列表
  caseTotalPages: 0; //历史病历总页数
  isShowHistoryAdvice = false; //查看历史医嘱显示
  // 显示查看历史医嘱弹出内容
  checkHistoryAdvice() {
    this.isShowHistoryAdvice = true;
    this.historyAdviceObj.accountId = this.user.data.id;
    this.historyAdviceObj.page = 0;
    // 获得历史医嘱数据
    this.httpReq.post(
      "/temp_orders/listCopy",
      null,
      this.historyAdviceObj,
      data => {
        if (data["code"] == 0) {
          this.historyAdviceList = data["data"]["content"];
          this.caseTotalPages = data["data"]["totalPages"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 导入医嘱
  importHistoryAdvice(data) {
    // 获得当前的日期和时间
    data.beginDate = this.getDateTime().date; //获得当前的日期和时间；
    data.beginTime = this.getDateTime().time; //获得当前的日期和时间；
    data.accountId = this.user.data.id; //当前登录用户的id
    // data.doctorName = ""; //当前登录用户的名字
    data.dorSign = "";
    data.operatorTime = "";
    data.operatorSign = "";
    data.state = "6";

    // 如果导入时  判断ordersum截取几个字符串 组成数组
    const objArr = [];
    // const objArr1 = [];
    for (let index = 0; index < 100000; index = index + 17) {
      const str = data.orderSum.slice(index, index + 17);
      if (str != "") {
        objArr.push(str);
      } else {
        this.isShowHistoryAdvice = false;
      }
    }
    data.objArr = objArr;
    this.drugLength += data.objArr.length;
    this.orderList.push(data);
    this.nullList.length = 22 - ((this.drugLength + this.sumLength) % 22);
  }
  // 关闭查看历史医嘱弹出框
  closeHistoryAdvice() {
    this.isShowHistoryAdvice = false;
  }

  loadMoreCase() {
    this.isShowHistoryAdvice = true;
    this.historyAdviceObj.accountId = this.user.data.id;
    this.historyAdviceObj.page += 1;
    this.httpReq.post(
      "/temp_orders/listCopy",
      null,
      this.historyAdviceObj,
      data => {
        if (data["code"] == 0) {
          this.historyAdviceList = this.historyAdviceList.concat(
            data["data"]["content"]
          );
          this.caseTotalPages = data["data"]["totalPages"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }
}
