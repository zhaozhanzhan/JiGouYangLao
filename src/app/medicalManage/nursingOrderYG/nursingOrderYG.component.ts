import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  Renderer
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { LocalStorage } from "../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { ENgxPrintComponent } from "e-ngx-print";
import * as _ from "underscore"; // Underscore工具类

@Component({
  selector: "app-nursingOrderYG",
  templateUrl: "./nursingOrderYG.component.html",
  styleUrls: ["./nursingOrderYG.component.css"]
})
export class NursingOrderYGComponent implements OnInit {
  @Input("patientId") patientId: string; // 病人ID

  public isPrintNow: boolean = false; // 是否正在打印
  public printCSS: Array<string> = []; // 打印内容css文件路径
  public printStyle: string = `

  .details span:nth-child(odd) {
    display: inline-block;
    width: 60px;
    margin-left: 2%;
}

.details {
    margin-bottom: 5px;
    font-size: 8pt;
}

.publicName {
    text-align: center;
    margin: 10px 0px;
    letter-spacing: 15px;
}

.adviceName {
    font-size: 24px;
    font-weight: bold;
}

.docName {
    font-size: 20px;
}

.marginTop {
    margin-top: 10px;
}

.textCenter {
    text-align: center
}
.textJustify{
  text-align: justify;
}
.sickDetails {
    color: #000;
    margin-bottom: 9px;
    margin-top: -16px;
    font-size: 15px;
}

:host /deep/ .ant-modal-body {
    padding: 15px !important;
}

.detailsSice {
    display: inline-block;
    margin-left: 10%;
}

.first {
    width: 160px !important;
    /*这里需要自己调整，根据自己的需求调整宽度*/
    position: relative;
    overflow: hidden;
}

.xieLine {
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

.executiveSignature {
    position: absolute;
    top: 11px;
    left: 25px;
}

.signature {
    position: absolute;
    top: 79px;
    left: 72px;
}

.xieLineStop {
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

.executiveSignatureStop {
    position: absolute;
    top: 6px;
    left: 13px;
}

.signatureStop {
    position: absolute;
    top: 30px;
    left: 72px;
}

.borderTop {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-top: 1px solid #000;
    border-right: 1px solid #000;
}



.borderOther {
    display: inline-block;
    width: 1px;
    height: 12px;
    background: #000;
}

.marginLeft {
    margin-left: 1%;
    display: inline-block
}

.left {
    width: 100%;
    float: left
}

// .right {
//     display: inline-block;
//     width: 25%;
//     float: right;
//     text-align: left;
// }

.cusTable {
    border-collapse: collapse;
    border: 1px solid black !important;
}

.cusTable td,
.cusTable th {
    border: 1px solid black !important;
    height: 30px !important;
    font-size:8pt;
}


/* 表格 */

.tabRelative {
    position: relative;
}

.tabAbsolute {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    overflow: hidden !important;
    width: 100%;
    height: 100%;
}

.widthImg {
    height: 100%;
    width: 100%;
}

.poTop {
    position: absolute;
    top: 2px;
    left: 3px;
}
.borderC {
  border-bottom: 1px solid #000;
  padding: 2px 0;
  width: 100%;
  text-align: left;
  height: 26px;
  line-height: 24px;
}

.borderB {
  /* border-bottom: 1px solid #000; */
  padding: 2px 0;
  width: 100%;
  text-align: left;
  height: 26px;
  line-height: 24px;
}
.poBottom {
    position: absolute;
    bottom: 2px;
    right: 3px;
}
.textLeft{
  text-align: left;
}
.cusTable td.noBorder{
  border-top: 1px solid transparent !important;
  border-left: 1px solid transparent !important;
  border-right: 1px solid transparent !important;
}
.w100p {
  width: 100% !important;
}
.smallSize{
  font-size: 10px
}
.lettSpan{
  display: inline-block;
    text-align: left;
}`;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件

  public formInfo: any = {
    basicInfo: {},
    sectionOffice: {},
    sickWard: {}
  }; // 基础信息
  public isVisible: boolean = false; // 新增弹出框是否可见
  public isMorseVisible: boolean = false; // Morse弹出框是否可见
  public isBradenVisible: boolean = false; // Braden弹出框是否可见

  // 保存参数
  saveInfo = {
    autar: "", // (string, optional): autar ,
    barthe: "", // (string, optional): barthe ,
    blooOxygen: "", // (string, optional): 血氧饱和度 ,
    bloodPressureHigh: "", // (string, optional): 高血压 ,
    bloodPressureLow: "", // (string, optional): 高血压 ,
    bloodSugar: "", // (string, optional): 血糖末梢 ,
    bodyTemperature: "", // (string, optional): 体温 ,
    branden: "", // (string, optional): branden ,
    breathing: "", // (string, optional): 呼吸(次/分) ,
    colorShape: "", // (string, optional): 颜色形状 ,
    createDate: "", // (string, optional): 记录时间 ,
    createTime: null, // (string, optional): 时间 ,
    heartRate: "", // (string, optional): 心率 ,
    id: "", // (string, optional),
    intakeAmount: "", // (string, optional): 入量量 ,
    intakeName: "", // (string, optional): 入量名称 ,
    measures: "", // (string, optional): 病情观察及护理措施 ,
    morse: "", // (string, optional): morse ,
    inHospitalId: "", // (string, optional): 老人id ,
    outtakeAmount: "", // (string, optional): 出量量 ,
    outtakeName: "", // (string, optional): 出量名称 ,
    pulse: "", // (string, optional): 脉搏(次/分)
    morseTemp: {
      cognitiveStatus: "", // (string, optional): 认知状态 ,
      fallBed: "", // (string, optional): 跌倒/坠床史 ,
      gait: "", // (string, optional): 步态 ,
      id: "", //(string, optional),
      intravenousTherapy: "", // (string, optional): 静脉治疗 ,
      medicalDiagnosis: "", //(string, optional): 超过一个医学诊断 ,
      walkingAid: "" // (string, optional): 使用助行器
    },
    bardenTemp: {
      activity: "", // (string, optional): 活动能力 ,
      feeling: "", // (string, optional): 感觉 ,
      friction: "", // (string, optional): 摩擦/剪切力 ,
      id: "", // (string, optional),
      movement: "", //: "", // (string, optional): 移动能力 ,
      nutrition: "", //: "", // (string, optional): 营养 ,
      wet: "" // (string, optional): 潮湿
    }
  };
  disabled = true;
  public tabList: Array<any> = []; // 数据列表
  public formData: Array<any> = []; // 表单数据
  public baseObj: any = {
    id: "", // 主键ID(有则是编辑)
    inHospitalInfoId: "", // 入院信息Id
    date: null, // 日期
    time: null, // 时间
    disease: "", // 病情
    empName: "", // 姓名
    accountId: "" // 账户Id
  };

  public sendObj: any = {}; // 请求数据条件对象

  public isDisable: boolean = false; // 是否禁用

  nullList: Array<any> = []; // 空数据数据列表
  listAll = []; //列表显示数组
  measureLength = 0; //共多少字段
  systemInfo; //系统信息
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private actRoute: ActivatedRoute, // 获取传递的参数
    private msg: NzMessageService, // 消息提醒
    private localStorage: LocalStorage, //存储
    private el: ElementRef, // 获取DOM元素对象
    private renderer: Renderer, // 对DOM进行操作
    private modalService: NzModalService //提示
  ) {
    const loginUser = this.localStorage.getUser();
    this.baseObj.accountId = loginUser["data"]["id"];
    this.baseObj.empName = loginUser["data"]["empName"];
    this.sendObj = {
      page: 0,
      size: 10,
      totalPages: 1
    };
  }
  sumLength = 14;
  ngOnInit() {
    this.nullList.length = this.sumLength;
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    let paramObj: any;
    const loginUser = this.localStorage.getUser();
    const personType = loginUser["data"]["employees"]["personType"];
    if (personType == "0") {
      // 医生
      this.disabled = false;
    } else if (personType == "2") {
      // 护士
      this.disabled = true;
    }
    try {
      paramObj = JSON.parse(this.actRoute.snapshot.queryParams["data"]); // 传递过来的参数
    } catch (error) {
      new Error("JSON数据转换出错.");
    }

    if (_.isObject(paramObj) && _.isObject(paramObj["inHospitalInfo"])) {
      this.patientId = paramObj["inHospitalInfo"]["id"];
    }

    if (_.isString(this.patientId) && this.patientId.length > 0) {
      this.baseObj.inHospitalInfoId = this.patientId; // 病人信息id
      const reqObj: any = {};
      reqObj.inHospitalInfoId = this.patientId; // 病人基本信息id
      this.sendObj.inHospitalInfoId = this.patientId;
      this.httpReq.post(
        "recordOfGeneralCare/listPage",
        null,
        this.sendObj,
        (data: any) => {
          if (data["code"] == 0) {
            const basObj = this.jsUtil.deepClone(
              data["data"]["inHospitalInfo"]
            );
            this.formInfo = basObj;
            const backData = this.jsUtil.deepClone(data["data"]);
            if (!_.isNull(backData.id)) {
              this.saveInfo.inHospitalId = backData.inHospitalInfo.id;
              this.getAllList();
            }
          }
        }
      );
    } else {
      this.msg.warning("未获取到老人ID");
    }
  }
  // 保存护理信息详情
  svarNursingInfo() {
    if (
      this.saveInfo.createDate == "" ||
      this.saveInfo.createTime == null ||
      this.saveInfo.createTime == ""
    ) {
      this.msg.error("日期时间不能为空！！！");
      return;
    }
    if (this.saveInfo.measures == "") {
      this.msg.error("病情观察及护理措施不能为空！！！");
      return;
    }
    this.saveInfo.inHospitalId = this.patientId;
    this.saveInfo.createDate = this.jsUtil.dateFormat(this.saveInfo.createDate);
    this.saveInfo.createTime = this.jsUtil.dateFormat(
      this.saveInfo.createTime,
      "HH:mm"
    );
  
    this.httpReq.post(
      "medNurseRecord/saveNurseRecord",
      null,
      this.saveInfo,
      (data: any) => {
        if (data["code"] == 0) {
          this.msg.success("保存成功");
          this.getAllList();
          this.isVisible = false;
        } else {
          this.isVisible = false; // 是否正在查询所有
        }
      }
    );
  }

  // 获得所有的护理记录单
  getAllList() {
    this.httpReq.get(
      "medNurseRecord/nurseRecordList",
      { inHospitalId: this.patientId, createDate: "" },
      (data: any) => {
        if (data["code"] == 0) {
          let list = [];
          list = data["data"];
          this.listAll = [];
          this.measureLength = 0;
          // 先遍历List 取所有的列表中的病情观察及护理措施
          for (let index = 0; index < list.length; index++) {
            let measuresList = []; //病理病情观察及护理措施列表
            let intakeNameList = []; //入量名称列表
            let outtakeNameList = []; //出量名称列表
            let colorShapeList = []; //颜色形状列表
            let morseList = []; //风险列表
            const e = this.jsUtil.deepClone(list[index]);
            // 一行显示12个 截取病情观察及护理措施 有几个数组
            const splitStr = e.measures; //病理病情观察及护理措施
            const splitLength = 12; //需要切割的长度

            const intakeNameStr = e.intakeName; //入量名称
            const intakeNameLength = 5; //需要切割的长度

            const outtakeNameStr = e.outtakeName; //出量量名称
            const outtakeNameLength = 5; //需要切割的长度

            const colorShapeStr = e.colorShape; //颜色形状
            const colorShapeLength = 5; //需要切割的长度
            let morseStr;
            if (e.morse == "" && e.branden == "") {
              morseStr = "";
            } else if (e.branden == "") {
              morseStr = "Morse" + e.morse; //风险评估
            } else if (e.morse == "") {
              morseStr = "Branden" + e.branden; //风险评估
            } else {
              morseStr = "Morse" + e.morse + "/" + "Branden" + e.branden; //风险评估
            }

            const morseLength = 5; //需要切割的长度

            // 获得每个字段切割下来的数组
            measuresList = this.getSlice(splitStr, splitLength, measuresList); //病理病情观察及护理措施
            intakeNameList = this.getSlice(
              intakeNameStr,
              intakeNameLength,
              intakeNameList
            ); //入量名称
            outtakeNameList = this.getSlice(
              outtakeNameStr,
              outtakeNameLength,
              outtakeNameList
            ); //出量量名称
            colorShapeList = this.getSlice(
              colorShapeStr,
              colorShapeLength,
              colorShapeList
            ); //颜色形状
            morseList = this.getSlice(morseStr, morseLength, morseList); //风险评估

            // 判断所有数组中哪个最大数
            const maxNum = Math.max(
              measuresList.length,
              intakeNameList.length,
              outtakeNameList.length,
              colorShapeList.length,
              morseList.length
            );

            // 根据最大数循环 赋值给listAll
            this.getListAll(
              maxNum,
              splitStr,
              measuresList,
              intakeNameStr,
              intakeNameList,
              outtakeNameList,
              outtakeNameStr,
              colorShapeList,
              colorShapeStr,
              morseList,
              morseStr,
              e
            );
          }
          this.nullList.length =
            this.sumLength - (this.measureLength % this.sumLength);
        } else {
        }
      }
    );
  }

  // 根据不同的字段切割返回不同的数组
  getSlice(str, leng, arr) {
    if (str == "") {
      arr.push(str);
    } else {
      if (str.length >= leng) {
        for (let i = 0; i < str.length / leng; i++) {
          let tempStr = str.slice(leng * i, leng * (i + 1));
          arr.push(tempStr);
        }
      } else {
        arr.push(str);
      }
    }

    return arr;
  }

  // 根据最长的数组添加到listAll数组中
  getListAll(
    maxNum,
    splitStr,
    measuresList,
    intakeNameStr,
    intakeNameList,
    outtakeNameList,
    outtakeNameStr,
    colorShapeList,
    colorShapeStr,
    morseList,
    morseStr,
    info
  ) {
    if (maxNum == measuresList.length) {
      if (splitStr == "") {
        const tempInfo = this.jsUtil.deepClone(info);
        this.listAll.push(tempInfo);
      } else {
        for (let index = 0; index < measuresList.length; index++) {
          const ele = measuresList[index];
          const tempInfo = this.jsUtil.deepClone(info);
          tempInfo.measures = ele;
          tempInfo.intakeName = intakeNameList[index];
          tempInfo.outtakeName = outtakeNameList[index];
          tempInfo.colorShape = colorShapeList[index];
          tempInfo.morse = morseList[index];
          if (index == 0) {
            const arr = tempInfo.createDate.split("-");
            tempInfo.createDate = arr[1] + "-" + arr[2];
          } else {
            tempInfo.createDate = "";
            tempInfo.createTime = null;
            this.getNull(tempInfo);
          }
          this.listAll.push(tempInfo);
        }
      }
      if (splitStr == "") {
        this.measureLength = this.measureLength + 1;
      } else {
        this.measureLength += measuresList.length;
      }
    } else if (maxNum == intakeNameList.length) {
      if (intakeNameStr == "") {
        const tempInfo = this.jsUtil.deepClone(info);
        this.listAll.push(tempInfo);
      } else {
        for (let index = 0; index < intakeNameList.length; index++) {
          const ele = intakeNameList[index];
          const tempInfo = this.jsUtil.deepClone(info);
          tempInfo.measures = measuresList[index];
          tempInfo.intakeName = ele;
          tempInfo.outtakeName = outtakeNameList[index];
          tempInfo.colorShape = colorShapeList[index];
          tempInfo.morse = morseList[index];
          if (index == 0) {
            const arr = tempInfo.createDate.split("-");
            tempInfo.createDate = arr[1] + "-" + arr[2];
          } else {
            tempInfo.createDate = "";
            tempInfo.createTime = null;
            this.getNull(tempInfo);
          }
          this.listAll.push(tempInfo);
        }
      }
      if (intakeNameStr == "") {
        this.measureLength = this.measureLength + 1;
      } else {
        this.measureLength += intakeNameList.length;
      }
    } else if (maxNum == outtakeNameList.length) {
      if (outtakeNameStr == "") {
        const tempInfo = this.jsUtil.deepClone(info);
        this.listAll.push(tempInfo);
      } else {
        for (let index = 0; index < outtakeNameList.length; index++) {
          const ele = outtakeNameList[index];
          const tempInfo = this.jsUtil.deepClone(info);
          tempInfo.measures = measuresList[index];
          tempInfo.intakeName = intakeNameList[index];
          tempInfo.outtakeName = ele;
          tempInfo.colorShape = colorShapeList[index];
          tempInfo.morse = morseList[index];
          if (index == 0) {
            const arr = tempInfo.createDate.split("-");
            tempInfo.createDate = arr[1] + "-" + arr[2];
          } else {
            tempInfo.createDate = "";
            tempInfo.createTime = null;
            this.getNull(tempInfo);
          }
          this.listAll.push(tempInfo);
        }
      }
      if (outtakeNameStr == "") {
        this.measureLength = this.measureLength + 1;
      } else {
        this.measureLength += outtakeNameList.length;
      }
    } else if (maxNum == colorShapeList.length) {
      if (colorShapeStr == "") {
        const tempInfo = this.jsUtil.deepClone(info);
        this.listAll.push(tempInfo);
      } else {
        for (let index = 0; index < colorShapeList.length; index++) {
          const ele = colorShapeList[index];
          const tempInfo = this.jsUtil.deepClone(info);
          tempInfo.measures = measuresList[index];
          tempInfo.intakeName = intakeNameList[index];
          tempInfo.outtakeName = outtakeNameList[index];
          tempInfo.morse = morseList[index];
          tempInfo.colorShape = ele;
          if (index == 0) {
            const arr = tempInfo.createDate.split("-");
            tempInfo.createDate = arr[1] + "-" + arr[2];
          } else {
            tempInfo.createDate = "";
            tempInfo.createTime = null;
            this.getNull(tempInfo);
          }
          this.listAll.push(tempInfo);
        }
      }
      if (colorShapeStr == "") {
        this.measureLength = this.measureLength + 1;
      } else {
        this.measureLength += colorShapeList.length;
      }
    } else {
      if (morseStr == "") {
        const tempInfo = this.jsUtil.deepClone(info);
        this.listAll.push(tempInfo);
      } else {
        for (let index = 0; index < morseList.length; index++) {
          const ele = morseList[index];
          const tempInfo = this.jsUtil.deepClone(info);
          tempInfo.measures = measuresList[index];
          tempInfo.intakeName = intakeNameList[index];
          tempInfo.outtakeName = outtakeNameList[index];
          tempInfo.colorShape = colorShapeList[index];
          tempInfo.morse = ele;
          if (index == 0) {
            const arr = tempInfo.createDate.split("-");
            tempInfo.createDate = arr[1] + "-" + arr[2];
          } else {
            tempInfo.createDate = "";
            tempInfo.createTime = null;
            this.getNull(tempInfo);
          }
          this.listAll.push(tempInfo);
        }
      }
      if (morseStr == "") {
        this.measureLength = this.measureLength + 1;
      } else {
        this.measureLength += morseList.length;
      }
    }
  }

  // 修改记录
  turnToEdit(id, e) {
    if (e) {
      e.preventDefault();
    }
    this.httpReq.get("medNurseRecord/detail", { id: id }, (data: any) => {
      if (data["code"] == 0) {
        this.saveInfo = data["data"];
        if (this.saveInfo.createTime == "") {
          this.saveInfo.createTime = null;
        } else {
          this.saveInfo.createTime = new Date(
            this.saveInfo.createDate + " " + this.saveInfo.createTime
          );
        }

        this.isVisible = true;
      } else {
      }
    });
  }

  // 删除记录
  delete(id, e) {
    if (e) {
      e.preventDefault();
    }
    this.modalService.confirm({
      nzTitle: "确认删除该记录？",
      nzContent: "",
      nzOkText: "确定",
      nzOkType: "danger",
      nzOnOk: () => {
        this.httpReq.post(
          "medNurseRecord/deleteNurseRecord",
          null,
          { id: id },
          data => {
            if (data["code"] == 0) {
              this.msg.success("删除成功！");
              this.getAllList();
            }
          }
        );
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }
  // 新增
  addData() {
    this.saveInfo = {
      autar: "", // (string, optional): autar ,
      barthe: "", // (string, optional): barthe ,
      blooOxygen: "", // (string, optional): 血氧饱和度 ,
      bloodPressureHigh: "", // (string, optional): 高血压 ,
      bloodPressureLow: "", // (string, optional): 高血压 ,
      bloodSugar: "", // (string, optional): 血糖末梢 ,
      bodyTemperature: "", // (string, optional): 体温 ,
      branden: "", // (string, optional): branden ,
      breathing: "", // (string, optional): 呼吸(次/分) ,
      colorShape: "", // (string, optional): 颜色形状 ,
      createDate: "", // (string, optional): 记录时间 ,
      createTime: null, // (string, optional): 时间 ,
      heartRate: "", // (string, optional): 心率 ,
      id: "", // (string, optional),
      intakeAmount: "", // (string, optional): 入量量 ,
      intakeName: "", // (string, optional): 入量名称 ,
      measures: "", // (string, optional): 病情观察及护理措施 ,
      morse: "", // (string, optional): morse ,
      inHospitalId: "", // (string, optional): 老人id ,
      outtakeAmount: "", // (string, optional): 出量量 ,
      outtakeName: "", // (string, optional): 出量名称 ,
      pulse: "", // (string, optional): 脉搏(次/分)
      morseTemp: {
        cognitiveStatus: "", // (string, optional): 认知状态 ,
        fallBed: "", // (string, optional): 跌倒/坠床史 ,
        gait: "", // (string, optional): 步态 ,
        id: "", //(string, optional),
        intravenousTherapy: "", // (string, optional): 静脉治疗 ,
        medicalDiagnosis: "", //(string, optional): 超过一个医学诊断 ,
        walkingAid: "" // (string, optional): 使用助行器
      },
      bardenTemp: {
        activity: "", // (string, optional): 活动能力 ,
        feeling: "", // (string, optional): 感觉 ,
        friction: "", // (string, optional): 摩擦/剪切力 ,
        id: "", // (string, optional),
        movement: "", //: "", // (string, optional): 移动能力 ,
        nutrition: "", //: "", // (string, optional): 营养 ,
        wet: "" // (string, optional): 潮湿
      }
    };
    this.isVisible = true;
  }
  // 显示More评分表
  onChangeMore(): void {
    this.isMorseVisible = true;
  }
  // 显示Branden评分表
  onChangeBranden() {
    this.isBradenVisible = true;
  }
  sum = 0;
  // 保存More评分表
  saveMorse() {
    if (
      this.saveInfo.morseTemp.fallBed == "" ||
      this.saveInfo.morseTemp.medicalDiagnosis == "" ||
      this.saveInfo.morseTemp.walkingAid == "" ||
      this.saveInfo.morseTemp.intravenousTherapy == "" ||
      this.saveInfo.morseTemp.gait == "" ||
      this.saveInfo.morseTemp.cognitiveStatus == ""
    ) {
      this.msg.error("请完整填写More评分表！！！");
      return;
    } else {
      this.sum =
        parseInt(this.saveInfo.morseTemp.fallBed) +
        parseInt(this.saveInfo.morseTemp.medicalDiagnosis) +
        parseInt(this.saveInfo.morseTemp.walkingAid) +
        parseInt(this.saveInfo.morseTemp.intravenousTherapy) +
        parseInt(this.saveInfo.morseTemp.gait) +
        parseInt(this.saveInfo.morseTemp.cognitiveStatus);
      this.saveInfo.morse = this.sum + "";
    }
    this.isMorseVisible = false;
  }
  sumBraden = 0;
  // 保存Braden
  saveBraden() {
    if (
      this.saveInfo.bardenTemp.feeling == "" ||
      this.saveInfo.bardenTemp.wet == "" ||
      this.saveInfo.bardenTemp.activity == "" ||
      this.saveInfo.bardenTemp.movement == "" ||
      this.saveInfo.bardenTemp.nutrition == "" ||
      this.saveInfo.bardenTemp.friction == ""
    ) {
      this.msg.error("请完整填写Braden评分表！！！");
      return;
    } else {
      this.sumBraden =
        parseInt(this.saveInfo.bardenTemp.feeling) +
        parseInt(this.saveInfo.bardenTemp.wet) +
        parseInt(this.saveInfo.bardenTemp.activity) +
        parseInt(this.saveInfo.bardenTemp.movement) +
        parseInt(this.saveInfo.bardenTemp.nutrition) +
        parseInt(this.saveInfo.bardenTemp.friction);
      this.saveInfo.branden = this.sumBraden + "";
    }
    this.isBradenVisible = false;
  }

  // 所有值为空
  getNull(tempInfo) {
    // this.listAll[index].morse = "";
    tempInfo.outtakeAmount = "";
    // this.listAll[index].outtakeName = "";
    tempInfo.pulse = "";
    tempInfo.morseTemp.cognitiveStatus = "";
    tempInfo.morseTemp.fallBed = "";
    tempInfo.morseTemp.gait = "";
    tempInfo.morseTemp.intravenousTherapy = "";
    tempInfo.morseTemp.medicalDiagnosis = "";
    tempInfo.morseTemp.walkingAid = "";
    tempInfo.autar = "";
    tempInfo.barthe = "";
    tempInfo.blooOxygen = "";
    tempInfo.bloodPressureHigh = "";
    tempInfo.bloodPressureLow = "";
    tempInfo.bloodSugar = "";
    tempInfo.bodyTemperature = "";
    tempInfo.branden = "";
    tempInfo.breathing = "";
    // this.listAll[index].colorShape = "";
    tempInfo.createDate = "";
    tempInfo.createTime = null;
    tempInfo.heartRate = "";
    tempInfo.intakeAmount = "";
    // this.listAll[index].intakeName = "";
  }
  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof NursingOrderComponent
   */
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.isPrintNow = true; // 正在打印
    this.disabled = false;
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof NursingOrderComponent
   */
  public printComplete() {
    this.isPrintNow = false;
    this.disabled = true;
  }
}
