import { JsUtilsService } from "./../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import {
  dayData,
  temperatureType,
  personInfo
} from "../../temperatureChartDraw/chartDraw/chartDataModel";
import { result } from "types/underscore";
import { LocalStorage } from "../../../common/service/local.storage";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/typings/overlay-directives";

@Component({
  selector: "app-temperatureForm",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class TemperatureFormComponent implements OnInit {
  //患者信息存放对象
  @Input()
  inHospitalId = "";

  @Input() BloodPressMode = "normal"; // 血压显示模式 normal 为正常模式

  personInfo: personInfo;
  isShowNusData = false; //护理记录单对话框显示
  listAll = []; //护理记录单数据列表
  isShowChoseTime = false; //选择时间段
  info = {
    bodyTemperature: "", //体温
    pulse: "", //脉搏
    breathing: "", //呼吸(次/分)
    heartRate: "", //心率(次/分)
    bloodPressureHigh: "", //高压
    bloodPressureLow: "", //低压
    intakeAmount: "", //入量
    createTime: null //时间
  }; //保存选择的记录信息
  chooseTime = ""; //选择的时间段
  //住院日数
  inDays = "1";
  //根据是否是当天，来判断页面上保存按钮、重置按钮是否可用
  isCurDate = true;

  //存放选择的日期对象，供查询使用
  queryDayDate;

  //当前页面是否处于loading状态
  isBtnLoading = false;
  //是否显示其他检测项对话框
  isShowInputOtherDialog = false;

  //是否显示常规检测项录入对话框
  isShowInputNormalDialog = false;
  //体温录入对话框的数据对象
  inputNormalInfo = {
    dayIndex: 0,
    pointIndex: 0,
    createTime: null,
    isSel: "0", //(1:导入)
    temperature: {
      valueStr: "",
      value: "",
      type: "",
      isUncheck: false
    }, //体温
    handingTemperature: {
      valueStr: "",
      value: "",
      type: ""
    }, //处理后体温
    pulse: "", //脉搏
    heartRate: "", //心率
    breathe: {
      valueStr: "",
      value: "",
      isMR: false, //是否使用呼吸机
      MRDays: "" //连续使用呼吸机日数
    }, //呼吸
    underLine42: {
      first: "",
      second: ""
    }, //42℃横线下标识
    aboveLine35: "", //35℃横线上标识
    underLine35: "" //35℃横线下标识
  };
  //存放某天的体温单数据信息；
  dayInfo;

  //当前登录者的信息
  user;
  accountId = "";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private jsUtil: JsUtilsService
  ) {
    this.user = this.localStorage.getUser();
    this.accountId = this.user.data.id;
    this.queryDayDate = new Date();
    //初始化数据
    this.iniDayInfo();
  }

  ngOnInit() {
    this.queryDayPointInfo();
  }

  /**
   * 初始化当天的数据
   */
  iniDayInfo() {
    this.dayInfo = {
      dayIndex: 0,
      dateStr: "", //当天日期
      inDays: "", //住院日数
      operationDays: "", //手术后日数
      pointsData: [],
      inTake: "", //入量
      shit: {
        valueStr: "", //用于体温表内容显示
        value: "", //正常大便次数
        isEnema: false, //是否保留灌肠
        enemaValue: "", //保留灌肠后大便次数
        isIncontinence: false, //是否失禁或假肛
        cleaningEnemaValue: "" //清洁灌肠后大便次数
      }, //大便
      urine: {
        valueStr: "",
        isIncontinence: false,
        value: "", //尿量数值
        isCatheterization: false //是否导尿
      }, //尿量
      dischargeOther: "", //其他排出量
      bloodPressure: {
        lowValue: "", //低压
        highValue: "", //高压
        lowValue1: "", //低压
        highValue1: "", //高压
        lowValue2: "", //低压
        highValue2: "" //高压
      }, //血压
      weight: "", //体重
      skinTest1: {
        testName: "",
        isPositive: false
      }, //皮试1
      skinTest2: {
        testName: "",
        isPositive: false
      }, //皮试2
      other: "" //其他
    };
    for (let index = 0; index < 6; index++) {
      let pointInfo = {
        dayIndex: 0,
        pointIndex: index,
        createTime: null,
        isSel: "0", //(1:导入)
        temperature: {
          valueStr: "",
          value: "",
          type: temperatureType.OralTemp,
          isUncheck: false
        }, //体温
        handingTemperature: {
          valueStr: "",
          value: "",
          type: temperatureType.OralTemp
        }, //处理后体温
        pulse: "", //脉搏
        heartRate: "", //心率
        breathe: {
          valueStr: "",
          value: "",
          isMR: false, //是否使用呼吸机
          MRDays: "" //连续使用呼吸机日数
        }, //呼吸
        underLine42: { first: "", second: "" }, //42℃横线下标识
        aboveLine35: "", //35℃横线上标识
        underLine35: "" //35℃横线下标识
      };
      this.dayInfo.pointsData.push(pointInfo);
    }

    this.dayInfo.dateStr = Utils.dateFormat(this.queryDayDate, "yyyy-MM-dd");
  }
  /**
   * 重置当天体温单的表单信息
   */
  reset() {
    this.iniDayInfo();
  }

  /**
   * 显示常规检测项录入对话框
   */
  waitState; //手写时填入的
  showInputNormalDialog(index, inputNormalInfo) {
    this.waitState = index;
    this.addState = "0"; //是填写的数据
    this.inputNormalInfo = inputNormalInfo;
    this.isShowInputNormalDialog = true;
  }
  /**
   * 常规检测项录入对话框中的确定按钮
   */
  inputNormalDialog_saveBtn() {
    if (this.inputNormalInfo.createTime == null) {
      this.message.error("时间不能为空");
      return;
    }
    this.inputNormalInfo.temperature.valueStr = this.changeTempValueStr(
      this.inputNormalInfo.temperature
    );
    this.inputNormalInfo.handingTemperature.valueStr = this.changeTempValueStr(
      this.inputNormalInfo.handingTemperature
    );
    this.inputNormalInfo.breathe.valueStr = this.changeBreatheValueStr(
      this.inputNormalInfo.breathe
    );

    if (this.addState == "1") {
      const info = this.jsUtil.deepClone(this.inputNormalInfo);
      const index = parseInt(this.chooseTime);
      this.dayInfo.pointsData[index] = info;
      this.dayInfo.pointsData[index].isSel = "1"; //护理记录单导入
      this.dayInfo.pointsData[index].pointIndex = parseInt(this.chooseTime);
    } else {
      const info = this.jsUtil.deepClone(this.inputNormalInfo);
      this.dayInfo.pointsData[this.waitState] = info;
      this.dayInfo.pointsData[this.waitState].isSel = "0"; //手动写入
      this.dayInfo.pointsData[this.waitState].pointIndex = parseInt(
        this.waitState
      );
    }
    this.isShowInputNormalDialog = false;
  }
  /**
   * 根据体温录入数据生成体温显示字符
   *
   * @param {*} tempInfo
   * @returns
   * @memberof FormComponent
   */
  changeTempValueStr(tempInfo) {
    let tempValueStr = "";
    if (tempInfo && !Utils.isEmpty(tempInfo.value)) {
      switch (parseInt(tempInfo.type)) {
        case temperatureType.OralTemp:
          tempValueStr = "●";
          break;
        case temperatureType.EarTemp:
          tempValueStr = "△";

          break;
        case temperatureType.OxterTemp:
          tempValueStr = "×";
          break;
        case temperatureType.AnorectumTemp:
          tempValueStr = "○";
          break;
      }
      return tempValueStr + tempInfo.value;
    } else {
      return "";
    }
  }

  /**
   *根据呼吸录入数据组合呼吸显示字符
   *
   * @param {*} breatheInfo
   * @memberof FormComponent
   */
  changeBreatheValueStr(breatheInfo) {
    let breatheValueStr = "";
    if (breatheInfo && !Utils.isEmpty(breatheInfo.value)) {
      if (breatheInfo.isMR) {
        breatheValueStr = `${breatheInfo.value}  MR(${breatheInfo.MRDays})`;
      } else {
        breatheValueStr = `${breatheInfo.value}`;
      }
    }
    return breatheValueStr;
  }

  /**
   * 显示其他检测项录入对话框
   */
  showInputOtherDialog() {
    this.isShowInputOtherDialog = true;
  }
  /**
   * 常规检测项录入对话框中的确定按钮
   */
  inputOtherDialog_saveBtn() {
    this.dayInfo.shit.valueStr = this.changeShitValueStr(this.dayInfo.shit);
    this.dayInfo.urine.valueStr = this.changeUrineValueStr(this.dayInfo.urine);
    this.isShowInputOtherDialog = false;
  }

  /**
   *根据大便录入数据组合大便显示字符
   *
   * @memberof FormComponent
   */
  changeShitValueStr(shitInfo) {
    let shitValueStr = "";
    if (!shitInfo) {
      return "";
    }
    //判断大便是否失禁
    if (shitInfo.isIncontinence) {
      shitValueStr = "※";
      if (shitInfo.isEnema) {
        shitValueStr = `${shitValueStr} ${shitInfo.cleaningEnemaValue}/E`;
      }
    } else {
      shitValueStr = shitInfo.value;
      if (shitInfo.isEnema) {
        shitValueStr = `${shitValueStr} ${shitInfo.enemaValue}/E`;
      }
    }
    return shitValueStr;
  }
  /**
   *根据尿量录入数据组合尿量显示字符
   *
   * @memberof FormComponent
   */
  changeUrineValueStr(urineInfo) {
    let urineValueStr = "";
    if (!urineInfo) {
      return "";
    }
    //判断小便是否失禁
    if (urineInfo.isIncontinence) {
      urineValueStr = "※";
    } else {
      urineValueStr = urineInfo.value;
      if (urineInfo.isCatheterization) {
        urineValueStr = `${urineInfo.value}/C`;
      }
    }
    return urineValueStr;
  }

  // 获取某一天的体温单数据
  queryDayPointInfo(): void {
    let dateStr = Utils.dateFormat(this.queryDayDate, "yyyy-MM-dd");
    if (dateStr == undefined) {
      this.queryDayDate = new Date();
    }
    let queryParam = {
      personInfoId: this.inHospitalId,
      dateStr: Utils.dateFormat(this.queryDayDate)
    };

    this.isBtnLoading = true;
    let that = this;
    this.httpReq.post("temp_chart/listForm", null, queryParam, data => {
      this.isBtnLoading = false;
      if (data["code"] == 0) {
        let resultData = JSON.parse(data.data);
        this.inDays = resultData.inDays;
        that.personInfo = resultData.personInfo;
        let dayDataArray = resultData.data;
        if (Utils.isArray(dayDataArray) && dayDataArray.length > 0) {
          this.dayInfo = dayDataArray[0];
          for (let index = 0; index < this.dayInfo.pointsData.length; index++) {
            const e = this.dayInfo.pointsData[index];
            if (e.createTime != "") {
              e.createTime = new Date(
                Utils.dateFormat(this.queryDayDate, "yyyy-MM-dd") +
                  " " +
                  e.createTime
              );
            }
          }
        }
      }
    });
  }

  /**
   * 选择的日期改变了
   */
  onDateChange() {
    if (this.dateDiff(this.queryDayDate, new Date()).toFixed(0) == "0") {
      //和当前日期相同
      this.isCurDate = true;
    } else {
      this.isCurDate = false;
    }
    this.iniDayInfo();
    this.queryDayPointInfo();
  }

  /**
   * 控制日期选择控件，只能选择入院日期之后的日期到今日日期之间
   *
   * @memberof TemperatureFormComponent
   */
  disabledDate = (current: Date): boolean => {
    return !(
      this.dateDiff(new Date(), current) < 0 &&
      this.dateDiff(current, new Date(this.personInfo.inDate)) < 0
    );
  };

  /**
   * 计算两个日期的相差天数
   */
  dateDiff(d1, d2) {
    var day = 24 * 60 * 60 * 1000;
    try {
      var checkTime = d1.getTime();
      var checkTime2 = d2.getTime();
      var cha = (checkTime2 - checkTime) / day;
      return cha;
    } catch (e) {
      return 0;
    }
  }

  /**
   * 保存当天的体温单信息
   */
  save() {
    this.dayInfo.dateStr = Utils.dateFormat(this.queryDayDate, "yyyy-MM-dd");
    let saveParam = {
      personInfoId: this.inHospitalId,
      accountId: this.accountId,
      data: [this.dayInfo]
    };

    for (let index = 0; index < this.dayInfo.pointsData.length; index++) {
      const e = this.dayInfo.pointsData[index];
      if (e.createTime && e.createTime != null) {
        e.createTime = this.jsUtil.dateFormat(e.createTime, "HH:mm");
      }
    }
    this.isBtnLoading = true;
    let that = this;
    this.httpReq.post("temp_chart/saveOrUpdate", null, saveParam, data => {
      this.isBtnLoading = false;
      if (data["code"] == 0) {
        console.log("tag", data.data);
        that.message.success("保存成功！");
        that.queryDayPointInfo();
      }
    });
  }

  // 显示护理数据弹出框
  importNursData() {
    const date = Utils.dateFormat(this.queryDayDate, "yyyy-MM-dd");
    this.httpReq.get(
      "medNurseRecord/nurseRecordList",
      { inHospitalId: this.inHospitalId, createDate: date },
      data => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.listAll = data["data"];
        }
      }
    );
    this.isShowNusData = true;
  }

  // 选择所属时间段
  addData(info) {
    this.info.bodyTemperature = info.bodyTemperature;
    this.info.pulse = info.pulse;
    this.info.breathing = info.breathing;
    this.info.heartRate = info.heartRate;
    this.info.bloodPressureHigh = info.bloodPressureHigh;
    this.info.bloodPressureLow = info.bloodPressureLow;
    this.info.intakeAmount = info.intakeAmount;
    // this.info.createTime = new Date(
    //   info.createDate + " " + info.createDate
    // );
    this.info.createTime = info.createTime;
    this.chooseTime = "";
    this.isShowChoseTime = true;
  }

  addState = "0";
  // 保存所选的数据
  saveChooseTime() {
    this.isShowChoseTime = false;
    this.isShowNusData = false;
    this.isShowInputNormalDialog = true;
    this.addState = "1"; //判断是导入的数据保存 还是自己填写的
    this.inputNormalInfo.temperature.value = this.info.bodyTemperature;
    this.inputNormalInfo.pulse = this.info.pulse;
    this.inputNormalInfo.heartRate = this.info.heartRate;
    this.inputNormalInfo.breathe.value = this.info.breathing;

    this.inputNormalInfo.createTime = new Date(
      Utils.dateFormat(this.queryDayDate, "yyyy-MM-dd") +
        " " +
        this.info.createTime
    );
    this.dayInfo.inTake = this.info.intakeAmount;
    this.dayInfo.bloodPressure.highValue = this.info.bloodPressureHigh;
    this.dayInfo.bloodPressure.lowValue = this.info.bloodPressureLow;
  }
}
