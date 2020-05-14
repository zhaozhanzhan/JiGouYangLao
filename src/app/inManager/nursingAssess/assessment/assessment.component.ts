import { Utils } from "../../../common/utils/utils";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
export class EmergencyContact {
  name: string;
  relationship: string;
  address: string;
  phone: string;
}

@Component({
  selector: "app-assessment",
  templateUrl: "./assessment.component.html",
  styleUrls: ["./assessment.component.scss"]
})
export class AssessmentComponent implements OnInit {
  Braden = false;
  Morse = false;
  old = {
    id: ""
  };
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
    saveContractParams: {
      zhend: ""
    },
    nursingGrade: {
      oldman: {
        name: "",
        birthYearMonth: "",
        education: "",
        inDate: "",
        occupation: "",
        sex: "",
        marriage: ""
      },
      asser: "",
      assDate: "",
      theDiagnosis: "",
      noteTaker: ""
    },
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
        zhend: "",
        bed: {
          bedName: ""
        }
      }
    }
  };

  assessment = {
    id: "",
    asser: "", //评估人
    assDate: "", //评估时间
    theDiagnosis: "", //入院诊断
    bradenHighRisk: "", //压疮高危
    modifier: "", //记录人
    morseHighRisk: "", //跌倒高危
    ngMemo: {}
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
    bed: {}, //床号
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

  // 老人信息
  oldmanInfo;
  apply;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService
  ) {}
  bedname = "";
  bar;
  ngOnInit() {
    let that = this;
    if (Utils.isEmpty(that.oldInfo.id)) {
      // this.showOldDialog();
    }
    if (Utils.isEmpty(that.oldInfo.id)) {
      // this.showOldDialog();
    }
    that.old.id = that.route.snapshot.paramMap.get("id");
    that.assessment.id = that.route.snapshot.paramMap.get("id");

    that.httpReq.post("nursingGrade/findById", null, that.old, data => {
      if (data["code"] == 0) {
        let result = data["data"];
        that.bar = JSON.parse(result.ngMemo);
        that.Params.ngMemo = JSON.parse(result.ngMemo);
        that.Params.nursingGrade = result.nursingGrade;
        that.Params.nursingGrade.oldman = result.nursingGrade.oldman;

        if (
          Utils.isNotEmpty(that.bar.saveContractParams.bed) &&
          that.bar.saveContractParams.bed.bedName != undefined
        ) {
          that.bedname = that.bar.saveContractParams.bed.bedName;
        } else {
          that.bedname = "";
        }

        that.sure();
        that.MorseSumCount();
      }
    });
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
      this.Params.ngMemo.BradenDetails.radioValue == "" ||
      this.Params.ngMemo.BradenDetails.moist == "" ||
      this.Params.ngMemo.BradenDetails.mobility == "" ||
      this.Params.ngMemo.BradenDetails.locomotivity == "" ||
      this.Params.ngMemo.BradenDetails.nutrition == "" ||
      this.Params.ngMemo.BradenDetails.friction == ""
    ) {
      this.createMessage("error", "请选择分数");
      this.isLoadingOne = false;
    } else {
      this.isLoadingOne = false;
      this.BradenSum =
        parseInt(this.Params.ngMemo.BradenDetails.radioValue) +
        parseInt(this.Params.ngMemo.BradenDetails.moist) +
        parseInt(this.Params.ngMemo.BradenDetails.mobility) +
        parseInt(this.Params.ngMemo.BradenDetails.locomotivity) +
        parseInt(this.Params.ngMemo.BradenDetails.nutrition) +
        parseInt(this.Params.ngMemo.BradenDetails.friction);
      this.cancel();
      if (this.BradenSum > 10) {
        this.Params.ngMemo.ulcers = "是";
      } else {
        this.Params.ngMemo.ulcers = "否";
      }
    }
  }
  //计算Morse的总和
  MorseSumCount() {
    this.isLoadingOne = true;
    if (
      this.Params.ngMemo.MorseDetails.HistoryFalling == "" ||
      this.Params.ngMemo.MorseDetails.medicalDiagnosis == "" ||
      this.Params.ngMemo.MorseDetails.WalkHelper == "" ||
      this.Params.ngMemo.MorseDetails.IntravenousTherapy == "" ||
      this.Params.ngMemo.MorseDetails.gait == "" ||
      this.Params.ngMemo.MorseDetails.cognitiveState == ""
    ) {
      this.createMessage("error", "请填写完整评分表");
      this.isLoadingOne = false;
    } else {
      this.isLoadingOne = false;
      this.MorseSum =
        parseInt(this.Params.ngMemo.MorseDetails.HistoryFalling) +
        parseInt(this.Params.ngMemo.MorseDetails.medicalDiagnosis) +
        parseInt(this.Params.ngMemo.MorseDetails.WalkHelper) +
        parseInt(this.Params.ngMemo.MorseDetails.IntravenousTherapy) +
        parseInt(this.Params.ngMemo.MorseDetails.gait) +
        parseInt(this.Params.ngMemo.MorseDetails.cognitiveState);
      if (this.MorseSum > 44) {
        this.Params.ngMemo.highRisk = "是";
      } else {
        this.Params.ngMemo.highRisk = "否";
      }
      this.Morse = false;
    }
  }
  isLoadingOne = false;
  // 保存护理评估表
  save() {
    let that = this;
    that.isLoadingOne = true;
    that.assessment.assDate = that.Params.nursingGrade.assDate;
    that.assessment.asser = that.Params.nursingGrade.asser;
    that.assessment.theDiagnosis = that.Params.nursingGrade.theDiagnosis;
    that.assessment.modifier = that.Params.nursingGrade.noteTaker;
    that.assessment.bradenHighRisk = that.Params.ngMemo.ulcers;
    that.assessment.morseHighRisk = that.Params.ngMemo.highRisk;
    that.assessment.ngMemo = that.Params.ngMemo;

    //   //  this.Params.oldman_id=
    //   that.httpService.doPostHttp(
    //            '/nursingGrade/edit',
    //            that.assessment,
    //            function(successful, result, res) {
    //             that.isLoadingOne=false;
    //              that.createMessage('success','修改成功');
    //              history.back();
    //   },
    //   function(successful, msg, err) {
    //              that.createMessage('error','修改失败');
    //   }
    // );

    let param = this.httpReq.post(
      "/nursingGrade/edit",
      null,
      that.assessment,
      data => {
        if (data["status"] == 200) {
          that.isLoadingOne = false;
          that.createMessage("success", "修改成功");
          history.back();
        }
      }
    );
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

  back() {
    history.back();
    // this.router.navigate(['/nursingHome/assessment/capacityAssess'], { relativeTo: this.route });
  }
}
