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
@Component({
  selector: "app-standingOrder",
  templateUrl: "./standingOrder.component.html",
  styleUrls: ["./standingOrder.component.css"]
})
export class StandingOrderComponent implements OnInit {
  @Input() inHospitalInfoId: string; // 病人ID
  @Input("patientId")
  patientId: string; // 病人ID
  @ViewChild("mainScreen") elementView: ElementRef;
  viewHeight: any;

  systemInfo; //系统信息
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件
  public printStyle: string = `
  #standingOrder .details span {
    display: inline-block;
    width: 50px;
    margin: 0 10px;
  }

  #standingOrder .details {
      margin-bottom: 5px;
      font-size: 8pt;
  }

  #standingOrder .publicName {
      text-align: center;
      margin: 10px 0px;
      letter-spacing: 15px;
  }

  #standingOrder .adviceName {
      font-size: 24px;
      font-weight: bold;
  }

  #standingOrder .docName {
      font-size: 20px;
  }

  #standingOrder .marginTop {
      margin-top: 10px;
  }

  #standingOrder .textCenter {
      text-align: center
  }

  #standingOrder .sickDetails {
      color: #000;
      margin-bottom: 9px;
      margin-top: -16px;
      font-size: 15px;
  }

  #standingOrder :host /deep/ .ant-modal-body {
      padding: 15px !important;
  }

  #standingOrder .detailsSice {
      display: inline-block;
      margin-left: 10%;
  }

  #standingOrder .first {
      width: 160px !important;
      /*这里需要自己调整，根据自己的需求调整宽度*/
      position: relative;
      overflow: hidden;
  }

  #standingOrder .xieLine {
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

  #standingOrder .executiveSignature {
      position: absolute;
      top: 11px;
      left: 25px;
  }

  #standingOrder .signature {
      position: absolute;
      top: 79px;
      left: 72px;
  }

  #standingOrder .xieLineStop {
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

  #standingOrder .executiveSignatureStop {
      position: absolute;
      top: 6px;
      left: 13px;
  }

  #standingOrder .signatureStop {
      position: absolute;
      top: 30px;
      left: 72px;
  }

  #standingOrder .borderTop {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-top: 1px solid #000;
      border-right: 1px solid #000;
  }



  #standingOrder .borderOther {
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #000;
  }

  #standingOrder .marginLeft {
      margin-left: 1%;
      display: inline-block
  }

  #standingOrder .left {
      width: 100%;
      float: left
  }

  #standingOrder .cusTable {
      border-collapse: collapse;
      border: 1px solid black !important;
  }

  #standingOrder .cusTable td,
  .cusTable th {
      border: 1px solid black !important;
      height: 30px !important;
      font-size:8pt;
  }


  /* 表格 */

  #standingOrder .tabRelative {
      position: relative;
  }

  #standingOrder .tabAbsolute {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      overflow: hidden !important;
      width: 100%;
      height: 100%;
  }

  #standingOrder .widthImg {
      height: 100%;
      width: 100%;
  }

  #standingOrder .poTop {
      position: absolute;
      top: 2px;
      left: 3px;
  }
  #standingOrder .borderC {
    border-bottom: 1px solid #000;
    padding: 2px 0;
    width: 100%;
    text-align: left;
    height: 26px;
    line-height: 24px;
  }

  #standingOrder .borderB {
    /* border-bottom: 1px solid #000; */
    padding: 2px 0;
    width: 100%;
    text-align: left;
    height: 26px;
    line-height: 24px;
  }
  #standingOrder .poBottom {
      position: absolute;
      bottom: 2px;
      right: 3px;
  }
  #standingOrder .textLeft{
    text-align: left;
  }
  #standingOrder .cusTable td.noBorder{
    border-top: 1px solid transparent !important;
    border-left: 1px solid transparent !important;
    border-right: 1px solid transparent !important;
  }
  #standingOrder .lettSpan{
    display: inline-block;
      text-align: left;
  }
  `; //打印时的样式
  isVisible = false; //新增药品医嘱对话框
  tabIndex = "0"; //显示哪个医嘱
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

  list = []; //已下达列表
  orderList = []; //未下达得列表

  nullList = []; //当已下达列表和未下达列表都没有时显示
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
  medRoomList = []; //获得药房列表
  addState = "add"; //添加或删除标签，确实是什么状态
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
    tabIndex: "", //第几个医嘱
    asBigUnit: false // 是否按盒扣
  };
  user; //用户信息
  isShowHistoryAdvice = false; //查看历史医嘱显示
  disabled = false;
  detailsAll;
  idStop; //医嘱的ID
  sunStatus; //判断审核时时确认审核还是停止确认审核
  // 获得长期医嘱列表
  detailsObj = {
    inHospitalInfoId: this.patientId,
    status: "",
    sunStatus: ""
  };

  orderListIsVisabled = true;

  drugLength = 0;
  public isConfirmBox: boolean = false; // 是否显示提示框
  public titStr: string = "是否确认？";
  public boxState: string = "确认";
  public confirmObj: any = null;

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
    if(this.inHospitalInfoId) this.patientId = this.inHospitalInfoId;
    if(typeof this.actRoute.snapshot.queryParams["data"] == 'string'){
      this.patientId = JSON.parse(this.actRoute.snapshot.queryParams["data"])["inHospitalInfo"]["id"]; // 传递过来的参数
    }
    console.log(this.patientId);
    if (_.isString(this.patientId) && this.patientId.length > 0) {
      const reqObj: any = {};
      reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
      this.httpReq.post("med_record/list", null, reqObj, (data: any) => {
        if (data["code"] == 0) {
          const result = data["data"];
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
    console.log(this.user);

    this.getAllDataDictionary();
    this.getListDetails();

    if (this.user.data.employees.personType == "0") {
      this.getNameList(); //获得医生下所有的病人的姓名
    }
  }

  clickMe() {
    this.viewHeight = this.elementView;
    console.log(this.viewHeight);
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
      tabIndex: "", //第几个医嘱
      asBigUnit: false // 是否按盒扣
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

    this.tabIndex = "0"; //默认打开医嘱是护理医嘱
    this.addState = state; //
    this.isVisible = true;
    this.disabled = false;
    this.drugDisabled = false;
  }

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
    this.isShow = false;
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
      html: "", //页面上绑定的HTML
      html1: "", //页面上绑定的HTML
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

      // 判断每个药品里面的用药频次是否为空
      for (
        let index = 0;
        index < this.westernMedicine.drugList.length;
        index++
      ) {
        const element = this.westernMedicine.drugList[index];
        if (element.medFrequency == "") {
          //如果用药频次为空时
          this.sureLoading = false;
          this.message.error("请选择用药频次");
          return;
        }
      }

      this.westernMedicine.tabIndex = this.tabIndex; //第几个医嘱
      obj.tabIndex = this.tabIndex;
      obj.orderSum = ""; //
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
        //根据判断药品的第几个数据 显示后面时什么样式
        if (index == 0 && this.westernMedicine.drugList.length > 1) {
          //如果时第一个
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
          console.log(this.westernMedicine.drugList.length);
        } else {
          //如果时最后一个
          // classStr = "borderOther";

          classStr =
            " display: inline-block; width: 10px; height: 10px;border-right: 1px solid #000;";
        }

        const name = e.name.split("（")[0];
        str += `药品名称:${name}     药品规格：${e.specification}   药品剂量：${
          e.dosage
        }  药品单位：${e.unitName}`;

        // 拼接成页面显示的数据
        e.usageName = e.usageName.split("-")[0];
        e.frequencyName = e.frequencyName;
        e.medFrequencyName = e.medFrequencyName.split("-")[0];
        if (this.westernMedicine.asBigUnit) {
          adviceHtml += `
        <div  style="position: relative; width:100%;text-align: left;    height: 30px; line-height: 30px;
        ">
            <span style='display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 80%;'>${name}${e.specification}
            </span>
            <span style="position: absolute;right: 1%;    top: 0px;display: inline-block;">
                <span>${e.bigUnitNum}${e.bigUnitName}${e.usageName}${
            e.frequencyName
          }${e.medFrequencyName}</span>
                <span  style="${classStr}"></span> <br>
            </span>
       </div>`;
        } else {
          if (index == 0) {
            adviceHtml += `
            <div  style="position: relative; width:100%;text-align: left;    height: 30px;line-height: 30px;
            ">
                <span style='display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 80%;'>${name}${e.specification}
                </span>
                <span style="position: absolute;right: 1%;    top: 0px;display: inline-block;">
                    <span>${e.dosage}${e.unitName}${e.usageName}${
              e.frequencyName
            }${e.medFrequencyName}</span>
                    <span  style="${classStr}"></span> <br>
                </span>
           </div>`;
          } else {
            adviceHtml += `
        <div   style="position: relative; width:100%;text-align: left;border-top: 1px solid #000;    height: 30px;line-height: 30px;
        ">
            <span style='display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 80%;'>${name}${e.specification}
            </span>
            <span style="position: absolute;right: 1%;    top: 0px;display: inline-block;">
                <span>${e.dosage}${e.unitName}${e.usageName}${e.frequencyName}${
              e.medFrequencyName
            }</span>
                <span  style="${classStr}"></span> <br>
            </span>
       </div>`;
          }
        }
      }

      obj.orderSum = `${str}用法：${this.westernMedicine.usageName}   频次：${
        this.westernMedicine.frequencyName
      }     其他：${this.westernMedicine.other} `;

      obj.html = adviceHtml;

      obj.html1 = adviceHtml1;
      obj.orderType = this.tabIndex;
      this.getMedRoomListAll();
      if (this.medRoomList.length > 0) {
        this.westernMedicine.medRoomId = this.medRoomList[0].id;
      }

      this.sureLoading = false;
      obj.orderDetail = JSON.stringify(this.westernMedicine);
    } else if (this.tabIndex == "1") {
      //如果是嘱托医嘱
      this.asksObj.tabIndex = this.tabIndex;
      obj.tabIndex = this.tabIndex;
      obj.orderDetail = JSON.stringify(this.asksObj);
      obj.orderSum = this.asksObj.saveAsks;

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
      console.log(this.specialObj.specialItemStr);
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

    console.error("没有下达添加之后的数字" + this.drugLength);
    console.error("下达之后的数字" + this.sumLength);
    console.error("余数的数字" + ((this.drugLength + this.sumLength) % 22));
    console.error("空的数字" + this.nullList.length);
    this.isVisible = false;
  }

  // 确认下达
  confirmOrder() {
    console.log(this.detailsAll);
    const obj = {
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

    obj.html = this.detailsAll.html;
    obj.html1 = this.detailsAll.html1;
    this.sureLoading = true;
    obj.orderType = this.tabIndex; //根据是什么医嘱显示
    obj.dorSign = this.user.data.name;
    // 确认下达医嘱
    this.httpReq.post("/long_term_orders/save", null, obj, data => {
      this.isDrugTableLoading = false;
      this.sureLoading = false;
      this.isVisible = false;
      if (data["code"] == 0) {
        this.message.success("下达成功");
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

    console.log(result);
    this.tabIndex = result.tabIndex;
    //smitState下达，stop停止，confirmed待确认，audit待审核，sureConfirmed待停止确认，sureAudit待停止审核
    if (
      state == "smitState" ||
      state == "stop" ||
      state == "confirmed" ||
      state == "audit" ||
      state == "sureConfirmed" ||
      state == "sureAudit" ||
      state == "cancel"
    ) {
      this.disabled = true;
    }

    if (
      state == "stop" ||
      state == "confirmed" ||
      state == "audit" ||
      state == "sureConfirmed" ||
      state == "sureAudit" ||
      state == "cancel"
    ) {
      this.idStop = data.id;
      if (data.sunStatus == "0" || data.sunStatus == "1") {
        //如果sunStatus状态时0或者1的时候，this.sunStatus是0
        this.sunStatus = "0"; //用于判断是0确认，1是停止确认或者0审核，1是停止审核
      } else {
        this.sunStatus = "1";
      }
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
      console.error(this.nullList.length);
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
    console.error(data);

    const details = JSON.parse(data.orderDetail).drugList;
    console.error(details);

    this.globalService.delModal(() => {
      this.orderList.splice(i, 1);

      if (details == undefined) {
        this.deleteSum += data.objArr.length;
      } else {
        this.deleteSum += details.length;
      }

      this.nullList.length =
        22 - ((this.drugLength + this.sumLength - this.deleteSum) % 22);

      console.error("删除之后空格" + this.nullList.length);
      console.error("删除的数组" + this.deleteSum);
      console.error("删除的数组this.drugLength" + this.drugLength);
      console.error("删除的数组this.sumLength" + this.sumLength);
      console.error(
        "删除的数组" +
          ((this.drugLength + this.sumLength - this.deleteSum) % 22)
      );
    });
  }

  //删除药品
  deleteDrug(i) {
    this.globalService.delModal(() => {
      this.westernMedicine.drugList.splice(i, 1);
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

    console.log(this.diagnosisObj.itemStr);
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

    console.log(flag);
    if (flag == true) {
      this.isShowDrug = true;
    } else {
      this.isShowOldDialog = true;
      this.getDrugAllList();
    }

    this.drugObj.search = "";
    this.getMedRoomListAll();
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

  // 获得药品的列表
  getDrugAllList(reset: boolean = false): void {
    if (reset) {
      this.drugPage.index = 1;
      console.log(this.drugPage.index);
    }
    this.drugObj.page = this.drugPage.index - 1;
    this.drugObj.size = this.drugPage.size;
    console.log(this.drugObj.page);
    if (this.drugObj.page < 0) {
      this.drugObj.page = 0;
    }
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
    console.log(data);
    let disabled = true;
    for (let i = 0; i < this.westernMedicine.drugList.length; i++) {
      if (this.westernMedicine.drugList[i].id == data.medDrug.id) {
        this.message.error("已经添加过此药品");
        disabled = false;
        return;
      }
    }

    if (disabled == true) {
      console.log(this.westernMedicine.drugList.length);
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
          }
          if (data.medDrug.largePackingUnit == e.dictValue) {
            wesEle.bigUnitName = e.dictTag;
          }
        }
      } else {
        const id =
          this.westernMedicine.drugList.length > 0
            ? this.westernMedicine.drugList[
                this.westernMedicine.drugList.length - 1
              ].id + 1
            : 0;

        const jiatingchengyuan = {
          id: "", //药品的ID
          name: "", //药品的名字
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
          }
          if (data.medDrug.largePackingUnit == e.dictValue) {
            wesEle.bigUnitName = e.dictTag;
          }
        }
      }
    }
  }

  sumLength = 0;
  // 获得已经下达的医嘱列表
  getListDetails() {
    this.detailsObj.inHospitalInfoId = this.patientId;
    if (
      (this.detailsObj.status == "" &&
        this.user.data.employees.personType == "0") ||
      (this.detailsObj.sunStatus == "" &&
        this.user.data.employees.personType == "2") ||
      (this.detailsObj.status == null &&
        this.user.data.employees.personType == "0") ||
      (this.detailsObj.sunStatus == null &&
        this.user.data.employees.personType == "2")
    ) {
      this.orderListIsVisabled = true;
    } else {
      this.orderListIsVisabled = false;
    }
    this.httpReq.post(
      "/long_term_orders/listAll",
      null,
      this.detailsObj,
      data => {
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
            // console.error("获得保存之后的几条数据" + this.sumLength);
            // console.error("获得保存之后的几条数据" + (this.sumLength % 22));
            // console.error("获得保存之后的几条数据" + this.nullList.length);
          }
        }
      }
    );
  }

  // 长期医嘱护士待确认
  sendConfirmed() {
    const obj = {
      longTermOrdersId: "", //"长期医嘱Id",
      status: "0", //"确认状态:0确认下达1确认停止",
      accountId: "" //"登陆账户Id"
    };
    obj.status = this.sunStatus;
    obj.longTermOrdersId = this.idStop;
    obj.accountId = this.user.data.id;
    this.httpReq.post("/long_term_orders/confirm", null, obj, data => {
      this.isDrugTableLoading = false;
      this.isVisible = false;
      if (data["code"] == 0) {
        this.message.success("医嘱确认成功");

        this.getListDetails();
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 长期医嘱护士待审核
  toAudit() {
    const obj = {
      longTermOrdersId: "", //"长期医嘱Id",
      status: "0", //"审核状态:0审核下达1审核停止",
      accountId: "" //"登陆账户Id"
    };
    obj.status = this.sunStatus;
    obj.longTermOrdersId = this.idStop;
    obj.accountId = this.user.data.id;
    this.httpReq.post("/long_term_orders/check", null, obj, data => {
      this.isDrugTableLoading = false;
      this.isVisible = false;
      if (data["code"] == 0) {
        this.message.success("医嘱审核成功");
        this.getListDetails();
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  // 长期医嘱下达停止操作
  stopAdvice() {
    const obj = {
      longTermOrdersId: "", //"长期医嘱Id",
      endDate: "", //结束日期
      endTime: "", //结束时间
      accountId: "" //"登陆账户Id"
    };

    obj.longTermOrdersId = this.idStop;
    obj.accountId = this.user.data.id;
    obj.endDate = this.getDateTime().date;
    obj.endTime = this.getDateTime().time;
    this.sureLoading = true;
    this.modalService.confirm({
      nzTitle: "请确认是否停止医嘱?",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        this.httpReq.post("/long_term_orders/stop", null, obj, data => {
          this.isDrugTableLoading = false;
          this.isVisible = false;
          this.sureLoading = false;
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

  // 获得药房列表
  getMedRoomListAll() {
    this.httpReq.post("/med_room/listAll", null, {}, data => {
      if (data["code"] == 0) {
        this.medRoomList = data["data"];
        if (this.medRoomList.length > 0) {
          this.drugObj.medRoomId = this.medRoomList[0].id;
          this.getDrugAllList();
        }
      } else {
        this.message.error(data["message"]);
      }
    });
  }

  /**
   * 显示弹出确认框
   * @param {string} state
   * @memberof StandingOrderComponent
   */
  showModal(state: string): void {
    this.isConfirmBox = true; // 是否显示提示框
    this.boxState = state;
    if (state == "确认") {
      this.titStr = "是否确认？";
    } else if (state == "审核") {
      this.titStr = "是否审核？";
    }
  }

  // 确认时
  handleOk(): void {
    console.log("Button ok clicked!");
    if (this.boxState == "确认") {
      this.sendConfirmed();
    } else if (this.boxState == "审核") {
      this.toAudit();
    }
    this.isConfirmBox = false;
    this.sureLoading = false;
  }

  // 取消时
  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isConfirmBox = false;
    this.sureLoading = false;
  }

  // 取消医嘱
  toCancel() {
    let obj = {
      longTermOrdersId: "", //"长期医嘱Id",
      accountId: "" //"登陆账户Id"
    };

    obj.longTermOrdersId = this.idStop;
    obj.accountId = this.user.data.id;
    this.httpReq.post("/long_term_orders/cancel", null, obj, data => {
      this.isDrugTableLoading = false;
      this.isVisible = false;
      this.sureLoading = false;
      if (data["code"] == 0) {
        this.message.success("取消医嘱成功");
        this.getListDetails();
      } else {
        this.message.error(data["message"]);
      }
    });
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
  // 显示查看历史医嘱弹出内容
  checkHistoryAdvice() {
    this.isShowHistoryAdvice = true;
    this.historyAdviceObj.accountId = this.user.data.id;
    this.historyAdviceObj.page = 0;
    // 获得历史医嘱数据
    this.httpReq.post(
      "/long_term_orders/listCopy",
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
    data.operatorSign = "";
    data.checkerSign = "";
    data.endDate = "";
    data.endTime = "";
    data.endDorSign = "";
    data.endOperatorSign = "";
    data.endCheckerSign = "";
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
      "/long_term_orders/listCopy",
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

  nameList = []; //病人的姓名7
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
}
