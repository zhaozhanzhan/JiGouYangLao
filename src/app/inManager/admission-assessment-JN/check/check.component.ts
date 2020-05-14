import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzModalService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.css"]
})
export class CheckComponent implements OnInit {
  dateFormat = "yyyy-MM-dd";
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
      }
    }
  };
  RiskAssessment: true;
  user;
  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService,
    private modalService: NzModalService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    let interviewId = this.route.snapshot.paramMap.get("id");
    this.Params.oldman_id = interviewId;
    this.user = this.localStorage.getUser();
    this.Params.noteTaker = this.user.data.name;
    // that.Params.noteTaker = that.notekeeper;
  }
  BradenPingfen() {
    this.Braden = true;
  }
  MorsePingfen() {
    this.Morse = true;
  }
  back() {
    history.back();
  }
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  // // 压疮危险性为是的时候的事件
  // ulcersChoose(){
  //   if(this.ulcers=="是"){
  //     this.Braden=true;
  //   }else{
  //     this.BradenSum=''
  //   }

  // }

  // // 跌倒/坠床高危是的时候的事件
  // highRiskChoose(){
  //   if(this.highRisk=="是"){
  //     this.Morse=true;
  //   }else{
  //     this.MorseSum=''
  //   }

  // }
  //点击取消的事件
  cancel() {
    this.Braden = false;
    this.ulcers = "否";
  }
  highRiskCancel() {
    this.Morse = false;
    this.highRisk = "否";
  }
  isLoadingOne = false;
  loadOne(): void {
    this.isLoadingOne = true;
    setTimeout(_ => {
      this.isLoadingOne = false;
    }, 1000);
  }
  //确定按钮计算总值
  sure() {
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
  //计算Morse的总和
  MorseSumCount() {
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
  showDeleteConfirm(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.del(() => {
      this.save();
    });
  }
  del(fun: Function) {
    this.modalService.confirm({
      nzTitle: "确认保存",
      nzContent: "入院评估内容保存成功后，可以到评估管理功能中修改。",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => fun(),
      nzCancelText: "取消",
      nzOnCancel: () => console.log("Cancel")
    });
  }
  // 保存护理评估表
  save() {
    let that = this;
    that.loadOne();
    that.Params.bradenHighRisk = that.ulcers;
    // that.Params.noteTaker = that.notekeeper;
    that.Params.morseHighRisk = that.highRisk;
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

    let param = this.httpReq.post(
      "/nursingGrade/save",
      null,
      this.Params,
      data => {
        if (data["status"] == 200) {
          that.createMessage("success", "保存成功");
          history.back();
        } else {
          that.createMessage("error", "保存失败");
        }
      }
    );
  }
}
