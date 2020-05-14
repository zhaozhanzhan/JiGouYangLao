import { Utils } from "../../../common/utils/utils";
import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../common/service/local.storage";

export class EmergencyContact {
  name: string;
  relationship: string;
  address: string;
  phone: string;
}
@Component({
  selector: "app-apply",
  templateUrl: "./apply.component.html",
  styleUrls: ["./apply.component.scss"]
})
export class ApplyComponent implements OnInit {
  Braden = false;
  Morse = false;
  asser;
  assDate;
  checkOptionsOne; //意识
  languageCompetence; //语言能力
  eyesight; //视力
  hearing; //听力
  mucousMembrane; //口腔黏膜
  mucousMembraneV;
  hearingV;
  falseToothV;
  falseTooth; //义&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;齿
  derma; //皮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;肤
  dermaV; //异常后面的书写
  ulcers; //压疮高危：
  BradenSum; //Braden评分
  pee; //小便：
  feces; //大便：
  fecesV; //多少次一日
  ache; //疼痛：
  acheV; //疼痛后面的说明
  mentality; //心里状态：
  mentalityV; //心里状态书写
  RelativeAttitude; //亲属态度：
  selfCare; //自理能力：
  smoking; //吸烟：
  Drinking; //饮酒：
  diet; //饮食习惯：
  xiV; //喜食
  jV; //忌食
  sleep; //睡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;眠
  assistedSleep; //药物辅助睡眠：
  assistedSleepV; //药物辅助睡眠详述
  medicalHistory; //既&nbsp;&nbsp;往&nbsp;&nbsp;史：
  medicalHistoryV; //既&nbsp;&nbsp;往&nbsp;&nbsp;史详细
  allergy; //过&nbsp;&nbsp;敏&nbsp;&nbsp;史
  yaoV; //药物：
  footV; //食物：
  otherV; //其他：
  highRisk; //跌倒/坠床高危
  MorseSum; //Morse评分
  hospitalizationCosts; //医疗费用：
  notekeeper; //记录人：

  radioValue = ""; //感觉的值
  moist = ""; //潮湿
  mobility = ""; //活动能力
  locomotivity = ""; //移动能力
  nutrition = ""; //营养（摄入）
  friction = ""; //摩擦/剪切力

  HistoryFalling = ""; //跌倒/坠床史分数
  medicalDiagnosis = ""; //
  WalkHelper = ""; //使用助行器
  IntravenousTherapy = ""; //静脉治疗
  gait = ""; //步态
  cognitiveState = ""; //认知状态
  Params = {
    oldman_id: "",
    asser: "", //评估人
    assDate: "", //评估时间
    theDiagnosis: "", //入院诊断
    bradenHighRisk: "", //压疮高危
    noteTaker: "", //记录人
    morseHighRisk: "", //跌倒高危
    saveContractParams: {},
    ngMemo: {
      mucousMembraneV: "",
      hearingV: "",
      falseToothV: "",
      checkOptionsOne: "",
      languageCompetence: "",
      eyesight: "", //视力
      hearing: "", //听力
      mucousMembrane: "", //口腔黏膜
      falseTooth: "", //义&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;齿
      derma: "", //皮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;肤
      dermaV: "", //异常后面的书写
      ulcers: "", //压疮高危：
      BradenSum: "", //Braden评分
      pee: "", //小便：
      feces: "", //大便：
      fecesV: "", //多少次一日
      ache: "", //疼痛：
      acheV: "", //疼痛后面的说明
      mentality: "", //心里状态：
      mentalityV: "", //心里状态书写
      RelativeAttitude: "", //亲属态度：
      selfCare: "", //自理能力：
      smoking: "", //吸烟：
      Drinking: "", //饮酒：
      diet: "", //饮食习惯：
      xiV: "", //喜食
      jV: "", //忌食
      sleep: "", //睡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;眠
      assistedSleep: "", //药物辅助睡眠：
      assistedSleepV: "", //药物辅助睡眠详述
      medicalHistory: "", //既&nbsp;&nbsp;往&nbsp;&nbsp;史：
      medicalHistoryV: "", //既&nbsp;&nbsp;往&nbsp;&nbsp;史详细
      allergy: "", //过&nbsp;&nbsp;敏&nbsp;&nbsp;史
      yaoV: "", //药物：
      footV: "", //食物：
      otherV: "", //其他：
      highRisk: "", //跌倒/坠床高危
      MorseSum: "", //Morse评分
      hospitalizationCosts: "", //医疗费用：
      notekeeper: "", //记录人：
      BradenDetails: {
        //点击压疮高危表单的详细字段
        radioValue: "",
        moist: "",
        mobility: "",
        locomotivity: "",
        nutrition: "",
        friction: ""
      },
      MorseDetails: {
        //跌倒/坠床危险
        HistoryFalling: "",
        medicalDiagnosis: "",
        WalkHelper: "",
        IntravenousTherapy: "",
        gait: "",
        cognitiveState: ""
      },
      saveContractParams: {
        bed: {
          bedName: ""
        }
      }
    }
  };
  RiskAssessment: true;
  //保存合同按钮的状态
  saveBtnLoading = false;
  searchOldName = "";
  saveContractParams = {
    oldman_id: "",
    name: "", //姓名
    birthYearMonth: "", //出生年月
    education: "", //文化程度：
    bed: {
      bedName: ""
    }, //床号
    admissionNo: "", //住院号
    occupation: "", //职业
    sex: "", //性别
    marriage: "", //婚姻状况

    inDate: "", //入院时间
    zhend: "" //诊断
  };

  //是否是编辑模式
  isModifyMode = false;
  oldQueryParams = {
    page: 0,
    size: 10,
    name: "",
    graranteesno: "",
    hasbed: "",
    nursinglevel: "",
    building: "",
    floor: "",
    room: ""
  };
  //老人列表table加载状态
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
    startOrStop: 1
  };
  contractResultData = {
    totalElements: 0
  };

  //是否显示选择老人对话框
  isShowOldDialog = false;

  //是否显示选择合同模板对话框
  isShowContractDialog = false;

  dateFormat = "yyyy-MM-dd";
  oldInfo = {
    id: "",
    name: "",
    oldmanUrl: "",
    sex: "",
    birthYearMonth: "",
    cardno: "",
    inDate: "",
    medicalPayment: "",
    medicalPaymentMemo: "",
    personnelSortMemo: "",
    personnelSort: "",
    phone: ""
  };
  contractInfo = {
    id: "",
    createDate: "",
    noteTaker: "",
    updateDate: "",
    modifier: "",
    name: "",
    tempMemo: "",
    startOrStop: 2
  };
  contractOutData = {
    signDate: "",
    effectDate: "",
    invalidDate: "",
    govSign1: "",
    govSign2: "",
    govSign3: "",
    relationSign1: "",
    relationSign2: ""
  };
  // 合同图片模式保存的地址
  public dischargeUrls = "";

  // 老年人信息
  oldmanInfo;

  apply;

  constructor(
    private localStorage: LocalStorage,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService
  ) {}

  BradenPingfen() {
    this.Braden = true;
  }
  MorsePingfen() {
    this.Morse = true;
  }
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  //点击取消的事件
  cancel() {
    this.Braden = false;
    this.ulcers = "否";
  }
  highRiskCancel() {
    this.Morse = false;
    this.highRisk = "否";
  }
  //确定按钮计算总值
  sure() {
    this.isLoadingOne = true;
    if (
      this.radioValue == "" ||
      this.moist == "" ||
      this.mobility == "" ||
      this.locomotivity == "" ||
      this.nutrition == "" ||
      this.friction == ""
    ) {
      this.createMessage("error", "请选择分数");
      this.isLoadingOne = false;
    } else {
      this.isLoadingOne = false;
      this.BradenSum =
        parseInt(this.radioValue) +
        parseInt(this.moist) +
        parseInt(this.mobility) +
        parseInt(this.locomotivity) +
        parseInt(this.nutrition) +
        parseInt(this.friction);
      this.cancel();
      if (this.BradenSum > 10) {
        this.ulcers = "是";
      } else {
        this.ulcers = "否";
      }
    }
  }
  //计算Morse的总和
  MorseSumCount() {
    this.isLoadingOne = true;
    if (
      this.HistoryFalling == "" ||
      this.medicalDiagnosis == "" ||
      this.WalkHelper == "" ||
      this.IntravenousTherapy == "" ||
      this.gait == "" ||
      this.cognitiveState == ""
    ) {
      this.isLoadingOne = false;
      this.createMessage("error", "请填写完整评分表");
    } else {
      this.isLoadingOne = false;
      this.MorseSum =
        parseInt(this.HistoryFalling) +
        parseInt(this.medicalDiagnosis) +
        parseInt(this.WalkHelper) +
        parseInt(this.IntravenousTherapy) +
        parseInt(this.gait) +
        parseInt(this.cognitiveState);
      if (this.MorseSum > 44) {
        this.highRisk = "是";
      } else {
        this.highRisk = "否";
      }
      this.Morse = false;
    }
  }
  isLoadingOne = false;
  user;
  // 保存护理评估表
  save() {
    this.user = this.localStorage.getUser();
    this.Params.noteTaker = this.user.data.name;
    let that = this;
    //  if(that.checkOptionsOne==undefined|| that.languageCompetence==undefined ||
    //  that.eyesight==undefined || that.hearing==undefined || that.mucousMembrane==undefined ||  that.falseTooth==undefined ||
    //  that.derma==undefined || that.ulcers==undefined || that.pee==undefined ||  that.feces==undefined ||
    //  that.ache==undefined || that.mentality==undefined || that.RelativeAttitude==undefined ||  that.selfCare==undefined ||
    //  that.smoking==undefined || that.Drinking==undefined || that.diet==undefined ||  that.sleep==undefined ||
    //  that.assistedSleep==undefined || that.medicalHistory==undefined || that.allergy==undefined ||  that.highRisk==undefined ||
    //  that.hospitalizationCosts==undefined ||  that.notekeeper==undefined || that.BradenSum==undefined ||
    //  that.MorseSum==undefined || that.assDate==undefined|| that.asser==undefined || that.saveContractParams.name==''){

    //    this.createMessage('error','请填写完整护理评估表');
    //  }else{
    that.isLoadingOne = true;

    if (
      that.BradenSum == undefined ||
      that.MorseSum == undefined ||
      that.assDate == undefined ||
      that.asser == undefined ||
      that.saveContractParams.name == ""
    ) {
      this.createMessage("error", "请填写完整护理评估表");
      that.isLoadingOne = false;
    } else {
      that.Params.oldman_id = that.saveContractParams.oldman_id;
      that.Params.saveContractParams = that.saveContractParams;
      that.Params.bradenHighRisk = that.ulcers;
      // that.Params.noteTaker = that.notekeeper;
      that.Params.morseHighRisk = that.highRisk;
      that.Params.theDiagnosis = that.saveContractParams.zhend;
      that.Params.assDate = this.jsUtil.dateFormat(this.assDate);

      that.Params.asser = that.asser;

      that.Params.ngMemo.checkOptionsOne = that.checkOptionsOne;
      that.Params.ngMemo.languageCompetence = that.languageCompetence;
      that.Params.ngMemo.eyesight = that.eyesight;
      that.Params.ngMemo.hearing = that.hearing;
      that.Params.ngMemo.mucousMembrane = that.mucousMembrane;
      that.Params.ngMemo.falseTooth = that.falseTooth;
      that.Params.ngMemo.derma = that.derma;
      that.Params.ngMemo.dermaV = that.dermaV;
      that.Params.ngMemo.ulcers = that.ulcers;
      that.Params.ngMemo.BradenSum = that.BradenSum;
      that.Params.ngMemo.pee = that.pee;
      that.Params.ngMemo.feces = that.feces;
      that.Params.ngMemo.fecesV = that.fecesV;
      that.Params.ngMemo.ache = that.ache;
      that.Params.ngMemo.acheV = that.acheV;
      that.Params.ngMemo.mentality = that.mentality;
      that.Params.ngMemo.mentalityV = that.mentalityV;
      that.Params.ngMemo.RelativeAttitude = that.RelativeAttitude;
      that.Params.ngMemo.selfCare = that.selfCare;
      that.Params.ngMemo.smoking = that.smoking;
      that.Params.ngMemo.Drinking = that.Drinking;
      that.Params.ngMemo.diet = that.diet;
      that.Params.ngMemo.xiV = that.xiV;
      that.Params.ngMemo.jV = that.jV;
      that.Params.ngMemo.sleep = that.sleep;
      that.Params.ngMemo.assistedSleep = that.assistedSleep;
      that.Params.ngMemo.medicalHistory = that.medicalHistory;
      that.Params.ngMemo.medicalHistoryV = that.medicalHistoryV;
      that.Params.ngMemo.allergy = that.allergy;
      that.Params.ngMemo.yaoV = that.yaoV;
      that.Params.ngMemo.footV = that.footV;
      that.Params.ngMemo.otherV = that.otherV;
      that.Params.ngMemo.highRisk = that.highRisk;
      that.Params.ngMemo.MorseSum = that.MorseSum;
      that.Params.ngMemo.hospitalizationCosts = that.hospitalizationCosts;
      that.Params.ngMemo.notekeeper = that.notekeeper;
      that.Params.ngMemo.mucousMembraneV = that.mucousMembraneV;
      that.Params.ngMemo.hearingV = that.hearingV;
      that.Params.ngMemo.falseToothV = that.falseToothV;

      that.Params.ngMemo.MorseDetails.HistoryFalling = that.HistoryFalling;
      that.Params.ngMemo.MorseDetails.medicalDiagnosis = that.medicalDiagnosis;
      that.Params.ngMemo.MorseDetails.WalkHelper = that.WalkHelper;
      that.Params.ngMemo.MorseDetails.IntravenousTherapy =
        that.IntravenousTherapy;
      that.Params.ngMemo.MorseDetails.gait = that.gait;
      that.Params.ngMemo.MorseDetails.cognitiveState = that.cognitiveState;
      that.Params.ngMemo.BradenDetails.radioValue = that.radioValue;
      that.Params.ngMemo.BradenDetails.moist = that.moist;
      that.Params.ngMemo.BradenDetails.mobility = that.mobility;
      that.Params.ngMemo.BradenDetails.locomotivity = that.locomotivity;
      that.Params.ngMemo.BradenDetails.nutrition = that.nutrition;
      that.Params.ngMemo.BradenDetails.friction = that.friction;
      that.Params.ngMemo.saveContractParams = that.saveContractParams;
      let param = this.httpReq.post(
        "/nursingGrade/save1",
        null,
        this.Params,
        data => {
          if (data["status"] == 200) {
            that.isLoadingOne = false;
            that.createMessage("success", "保存成功");
            history.back();
          }
        }
      );

      //  this.httpService.doPostHttp(
      //          '/nursingGrade/save1',
      //          this.Params,
      //          function(successful, result, res) {
      //           that.isLoadingOne=false;
      //            that.createMessage('success','保存成功');
      //            history.back();
      //          },
      //          function(successful, msg, err) {
      //            that.createMessage('error','保存失败');
      //          }
      //        );
    }
  }
  /**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }

  /**
   * 显示老人选择对话框，并加载老人列表
   */
  showOldDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowOldDialog = true;
    this.loadingOldList();
  }
  /**
   * 加载老人列表
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
    let param = this.httpReq.post(
      "oldman/list1",
      null,
      this.oldQueryParams,
      data => {
        that.oldQueryParams.page++;
        that.isOldTableLoading = false;
        if (data["status"] == 200) {
          this.oldDataArray = data["data"]["content"]; // 数据列表
          this.oldResultData.totalElements = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }
  /**
   * 老人选择对话框中选择了某个老人；
   */
  chooseOld(oldInfo) {
    this.isShowOldDialog = false;
    this.saveContractParams.oldman_id = oldInfo.id;
    this.saveContractParams.name = oldInfo.name;
    this.saveContractParams.birthYearMonth = oldInfo.birthYearMonth;
    this.saveContractParams.education = oldInfo.education;
    this.saveContractParams.admissionNo = oldInfo.admissionNo;
    this.saveContractParams.occupation = oldInfo.occupation;
    this.saveContractParams.sex = oldInfo.sex;
    this.saveContractParams.marriage = oldInfo.marriage;
    this.saveContractParams.inDate = oldInfo.inDate;
    if (oldInfo.bed != null) {
      this.saveContractParams.bed.bedName = oldInfo.bed.bedName;
      this.Params.ngMemo.saveContractParams.bed.bedName = oldInfo.bed.bedName;
    } else {
      this.saveContractParams.bed.bedName = oldInfo.bed.bedName;
      this.Params.ngMemo.saveContractParams.bed.bedName = oldInfo.bed.bedName;
    }
    // this.saveContractParams.bed = this.oldInfo.bed;
  }

  ngOnInit() {
    if (Utils.isEmpty(this.oldInfo.id)) {
      // this.showOldDialog();
    }

    this.apply = {
      memo: {},
      diseaseMemo: {},
      accidentMemo: {},
      contactsMemo: {}
    };
    this.oldmanInfo = {
      infoMemo: {}
    };

    const date = new Date();
    this.apply.assDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    this.apply.assNum = date.valueOf();
  }

  back() {
    history.back();
    // this.router.navigate(['/nursingHome/assessment/capacityAssess'], { relativeTo: this.route });
  }

  onSave() {
    const that = this;
    this.httpReq.post("assessmentAppay/save", null, this.apply, data => {
      that.saveBtnLoading = false;
      if (data["code"] == 0) {
        that.message.success("保存成功！");
        that.back();
      }
    });
  }
}
