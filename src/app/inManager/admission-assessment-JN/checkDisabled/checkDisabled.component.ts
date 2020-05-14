import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
@Component({
  selector: "app-checkDisabled",
  templateUrl: "./checkDisabled.component.html",
  styleUrls: ["./checkDisabled.component.css"]
})
export class CheckDisabledComponent implements OnInit {
  dateFormat = "yyyy-MM-dd";
  resulDetails; //详情
  Braden = false;
  Morse = false;

  mucousMembraneV;
  asser;
  assDate;
  hearingV;
  falseToothV;
  checkOptionsOne; //意识
  languageCompetence; //语言能力
  eyesight; //视力
  hearing; //听力
  mucousMembrane; //口腔黏膜
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
    oldman_id: ""
  };
  RiskAssessment: true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    let interviewId = this.route.snapshot.paramMap.get("id");
    let that = this;
    that.Params.oldman_id = interviewId;

    this.httpReq.post("nursingGrade/findByOldman", null, this.Params, data => {
      if (data["code"] == 0) {
        that.resulDetails = data["data"]["ngMemo"];
        that.resulDetails = JSON.parse(that.resulDetails);
        that.checkOptionsOne = that.resulDetails.checkOptionsOne;
        that.languageCompetence = that.resulDetails.languageCompetence;
        that.eyesight = that.resulDetails.eyesight;
        that.hearing = that.resulDetails.hearing;
        that.mucousMembrane = that.resulDetails.mucousMembrane;
        that.falseTooth = that.resulDetails.falseTooth;
        that.derma = that.resulDetails.derma;
        that.dermaV = that.resulDetails.dermaV;
        that.ulcers = that.resulDetails.ulcers;
        that.BradenSum = that.resulDetails.BradenSum;
        that.pee = that.resulDetails.pee;
        that.feces = that.resulDetails.feces;
        that.ache = that.resulDetails.ache;
        that.acheV = that.resulDetails.acheV;
        that.mentality = that.resulDetails.mentality;
        that.mentalityV = that.resulDetails.mentalityV;
        that.RelativeAttitude = that.resulDetails.RelativeAttitude;
        that.selfCare = that.resulDetails.selfCare;
        that.smoking = that.resulDetails.smoking;
        that.Drinking = that.resulDetails.Drinking;
        that.diet = that.resulDetails.diet;
        that.xiV = that.resulDetails.xiV;
        that.jV = that.resulDetails.jV;
        that.sleep = that.resulDetails.sleep;
        that.assistedSleep = that.resulDetails.assistedSleep;
        that.medicalHistory = that.resulDetails.medicalHistory;
        that.medicalHistoryV = that.resulDetails.medicalHistoryV;
        that.allergy = that.resulDetails.allergy;
        that.fecesV = that.resulDetails.fecesV;
        that.yaoV = that.resulDetails.yaoV;
        that.footV = that.resulDetails.footV;
        that.otherV = that.resulDetails.otherV;
        that.highRisk = that.resulDetails.highRisk;
        that.MorseSum = that.resulDetails.MorseSum;
        that.hospitalizationCosts = that.resulDetails.hospitalizationCosts;
        that.notekeeper = that.resulDetails.notekeeper;

        that.checkOptionsOne = that.resulDetails.checkOptionsOne;
        that.languageCompetence = that.resulDetails.languageCompetence;
        that.eyesight = that.resulDetails.eyesight;
        that.hearing = that.resulDetails.hearing;
        that.mucousMembrane = that.resulDetails.mucousMembrane;
        that.falseTooth = that.resulDetails.falseTooth;
        that.derma = that.resulDetails.derma;
        that.dermaV = that.resulDetails.dermaV;
        that.ulcers = that.resulDetails.ulcers;
        that.BradenSum = that.resulDetails.BradenSum;
        that.pee = that.resulDetails.pee;
        that.feces = that.resulDetails.feces;
        that.ache = that.resulDetails.ache;
        that.acheV = that.resulDetails.acheV;
        that.mentality = that.resulDetails.mentality;
        that.mentalityV = that.resulDetails.mentalityV;
        that.RelativeAttitude = that.resulDetails.RelativeAttitude;
        that.selfCare = that.resulDetails.selfCare;
        that.smoking = that.resulDetails.smoking;
        that.Drinking = that.resulDetails.Drinking;
        that.diet = that.resulDetails.diet;
        that.xiV = that.resulDetails.xiV;
        that.jV = that.resulDetails.jV;
        that.sleep = that.resulDetails.sleep;
        that.assistedSleep = that.resulDetails.assistedSleep;
        that.medicalHistory = that.resulDetails.medicalHistory;
        that.medicalHistoryV = that.resulDetails.medicalHistoryV;
        that.allergy = that.resulDetails.allergy;
        that.yaoV = that.resulDetails.yaoV;
        that.footV = that.resulDetails.footV;
        that.otherV = that.resulDetails.otherV;
        that.highRisk = that.resulDetails.highRisk;
        that.MorseSum = that.resulDetails.MorseSum;
        that.hospitalizationCosts = that.resulDetails.hospitalizationCosts;
        that.notekeeper = that.resulDetails.notekeeper;
        // that.resulDetails.nursingGrade=JSON.parse(that.resulDetails.nursingGrade);
        // console.log("nursingGrade"+that.resulDetails.nursingGrade)

        that.asser = data["data"]["nursingGrade"]["asser"];
        that.assDate = data["data"]["nursingGrade"]["assDate"];
        that.resulDetails = JSON.parse(that.resulDetails);

        that.mucousMembraneV = that.resulDetails.mucousMembraneV;
        that.hearingV = that.resulDetails.hearingV;
        that.falseToothV = that.resulDetails.falseToothV;
        that.HistoryFalling = that.resulDetails.MorseDetails.HistoryFalling;
        that.medicalDiagnosis = that.resulDetails.MorseDetails.medicalDiagnosis;
        that.WalkHelper = that.resulDetails.MorseDetails.WalkHelper;
        that.IntravenousTherapy =
          that.resulDetails.MorseDetails.IntravenousTherapy;
        that.gait = that.resulDetails.MorseDetails.gait;
        that.cognitiveState = that.resulDetails.MorseDetails.cognitiveState;
        that.radioValue = that.resulDetails.BradenDetails.radioValue;
        that.moist = that.resulDetails.BradenDetails.moist;
        that.mobility = that.resulDetails.BradenDetails.mobility;
        that.locomotivity = that.resulDetails.BradenDetails.locomotivity;
        that.nutrition = that.resulDetails.BradenDetails.nutrition;
        that.friction = that.resulDetails.BradenDetails.friction;
      }
    });
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

  //点击取消的事件
  cancel() {
    this.Braden = false;
  }
  highRiskCancel() {
    this.Morse = false;
  }
}
