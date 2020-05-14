import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as _ from "underscore"; // JS工具类
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Local } from "../../../common/service/Storage";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  abilityAssess; //评估人基本信息
  tabIndex;
  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private router: Router, // 跳转路由
    private actRoute: ActivatedRoute, // 获取传递的参数
    private fb: FormBuilder, // 响应式表单
    private msg: NzMessageService, // 消息提醒
    private modalService: NzModalService,
    private localStroage: LocalStorage
  ) {}
  isLoadingOne = false; //保存得加载状态
  getParam;
  data = new Date();
  disabled = true; //如果没有保存能力评估，其他得不可点
  userInfo; //用户信息
  // 能力评估表保存参数
  assessmentObj = {
    assId: "", //"评估id",
    oldmanId: "", //"老人id",
    assDate: "", //"评估时间",
    accountId: "" //"账户id"
  };
  assId; //评估得id

  // 生活能力评估参数
  viabilityObj = {
    assId: "", //"评估id",
    eatFood: "0", //"进食",
    modificationAndBath: "0", //"修饰及洗浴",
    wearAndUndress: "0", //"穿、脱衣",
    excretionAndToilet: "0", //"排泄及如厕",
    move: "0", //"移动",
    selfAbilityTotalScore: "0", //"生活自理能力总分"
    lifeAbilityScore: "正常" //根据分数获得等级
  };

  //认知能力评估管理
  cognitiveObj = {
    assId: "", //"评估id",
    recentMemory: "0", //"近期记忆",
    proceduralMemory: "0", //"程序记忆",
    directionalAbility: "0", //"定向力",
    judgementAbility: "0", //"判断力",
    cognitiveAbilityTotalScore: "0", //"认知能力总分"
    cognitiveScore: "正常" //根据分数获得等级
  };

  // 情绪行为评估管理
  emotionalBehaviorObj = {
    assId: "", //"评估id",
    emotion: "0", //"情绪",
    behavior: "0", //"行为",
    communicateAbility: "0", //"沟通力",
    emotionalBehaviorTotalScore: "0", //"情绪行为总分"
    emotionalBehaviorScore: "正常" //根据分数获得等级
  };

  // 视觉评估管理
  viewObj = {
    assId: "", //"评估id",
    view: "0", //"视觉"
    viewTotalScore: "0", //"视觉总分"
    viewScore: "正常" //"视觉总分"
  };

  // 能力评估总结管理
  assessmentSumObj = {
    assId: "", //"评估id",
    asser: "", //"评估人签字",
    oldmanName: "", //"老人签字",
    guardian: "", //"监护人/担保人签字",
    assessmentTotalScore: "", //"等级评估总分",
    careAdvice: "", //"照护等级"
    dorAdvice: "", //"医生意见",
    deanAdvice: "", //"院长意见",
    deanAdviceDate: "", //"院长意见时间"
    data: "",
    month: "",
    day: ""
  };
  ngOnInit() {
    const that = this;
    this.tabIndex = 0; // Tab标签页索引值
    this.abilityAssess = {
      // 能力评估基本信息
      oldman_id: "", // 老年人ID
      asser: "", // 评估人
      assDate: "", // 评估时间
      assCode: "", // 评估编号
      assReason: "接受服务前初评", // 评估原因（15）
      personInfo: {}, // 被评估人信息
      noteTaker: Local.getObj("UserInfo").name, // 记录人
      dementiaDiagnosis: "",
      mentalDiseaseDiagnosis: "",
      chronicDiseaseDiagnosis: "",
      fallDownAccd: "",
      wanderAwayAccd: "",
      chokeFeedAccd: "",
      commitSuicideAccd: "",
      otherAccd: "",
      infoProvider: "", //信息提供者的姓名
      infoProviderRelationship: "", //信息提供者于老人的关系
      contactName: "", //联系人姓名
      contactPhone: "" //联系人电话
    };

    // 通过传递过来的参数查找评估人的基本信息
    this.getParam = this.actRoute.snapshot.paramMap["params"]; // 传递过来的参数
    const objId: any = {};
    objId.id = this.getParam.id;

    this.httpReq.post("oldman/findById", null, objId, data => {
      if (data["status"] == 200) {
        const resData = JSON.parse(data["data"]);
        const perInfo = this.abilityAssess.personInfo;
        perInfo.name = resData["name"];
        perInfo.sex = resData["sex"];
        perInfo.birthYearMonth = resData["birthYearMonth"];
        perInfo.cardno = resData["cardno"];
        perInfo.medicalCard = resData["medicalCard"];
        perInfo.nation = resData["nation"];
        perInfo.education = resData["education"];
        perInfo.religion = resData["religion"];
        perInfo.religionMemo = resData["religionMemo"];
        perInfo.marriage = resData["marriage"];
        perInfo.livingSituation = resData["livingSituation"];
        perInfo.financialResources = resData["financialResources"];
      }
    });

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
  }

  // 保存能力评估
  assessmentSave() {
    this.assessmentObj.assDate = this.jsUtil.dateFormat(
      this.data,
      "YYYY-MM-DD  00:00:00"
    );
    this.assessmentObj.accountId = this.userInfo.id;
    this.assessmentObj.oldmanId = this.getParam.id;
    this.isLoadingOne = true;
    this.httpReq.post(
      "/jnyyy_assessment_appay/saveOrUpdate",
      null,
      this.assessmentObj,
      data => {
        this.isLoadingOne = false;
        if (data["code"] == 0) {
          this.msg.success("保存成功");
          const result = data["data"];
          this.assId = result.id;
          this.disabled = false;
          this.tabIndex++;
          window.scrollTo(0, 0); // 回到顶部
        }
      }
    );
  }

  // 保存生活能力评估表
  viabilitySave() {
    this.viabilityObj.assId = this.assId;
    this.isLoadingOne = true;
    this.httpReq.post(
      "/jnyyy_assessment_self_ability/saveOrUpdate",
      null,
      this.viabilityObj,
      data => {
        this.isLoadingOne = false;
        if (data["code"] == 0) {
          this.msg.success("保存成功");
          this.tabIndex++;
          window.scrollTo(0, 0); // 回到顶部
        }
      }
    );
  }

  // 当改变生活能力分数时;
  addSum() {
    const sum =
      parseInt(this.viabilityObj.eatFood) +
      parseInt(this.viabilityObj.modificationAndBath) +
      parseInt(this.viabilityObj.wearAndUndress) +
      parseInt(this.viabilityObj.excretionAndToilet) +
      parseInt(this.viabilityObj.move);
    if (sum >= 0 && sum <= 2) {
      this.viabilityObj.lifeAbilityScore = "正常";
      this.viabilityObj.selfAbilityTotalScore = "0";
    } else if (sum > 3 && sum <= 14) {
      this.viabilityObj.lifeAbilityScore = "轻度依赖";
      this.viabilityObj.selfAbilityTotalScore = "7";
    } else if (sum > 15 && sum <= 30) {
      this.viabilityObj.lifeAbilityScore = "中度依赖";
      this.viabilityObj.selfAbilityTotalScore = "21";
    } else if (sum >= 31) {
      this.viabilityObj.lifeAbilityScore = "重度依赖";
      this.viabilityObj.selfAbilityTotalScore = "35";
    } else {
    }
  }

  // 保存认知能力评估管理
  cognitiveSave() {
    this.cognitiveObj.assId = this.assId;
    this.isLoadingOne = true;
    this.httpReq.post(
      "/jnyyy_assessment_cognitive_ability/saveOrUpdate",
      null,
      this.cognitiveObj,
      data => {
        this.isLoadingOne = false;
        if (data["code"] == 0) {
          this.msg.success("保存成功");
          this.tabIndex++;
          window.scrollTo(0, 0); // 回到顶部
        }
      }
    );
  }

  addCognitiveScore() {
    const sum =
      parseInt(this.cognitiveObj.recentMemory) +
      parseInt(this.cognitiveObj.proceduralMemory) +
      parseInt(this.cognitiveObj.directionalAbility) +
      parseInt(this.cognitiveObj.judgementAbility);
    if (sum >= 0 && sum <= 4) {
      this.cognitiveObj.cognitiveScore = "正常";
      this.cognitiveObj.cognitiveAbilityTotalScore = "0";
    } else if (sum > 5 && sum <= 14) {
      this.cognitiveObj.cognitiveScore = "轻度缺失";
      this.cognitiveObj.cognitiveAbilityTotalScore = "6";
    } else if (sum > 15 && sum <= 29) {
      this.cognitiveObj.cognitiveScore = "中度缺失";
      this.cognitiveObj.cognitiveAbilityTotalScore = "18";
    } else if (sum >= 30) {
      this.cognitiveObj.cognitiveScore = "重度缺失";
      this.cognitiveObj.cognitiveAbilityTotalScore = "30";
    } else {
    }
  }

  // 保存情绪行为评估管理
  emotionalBehaviorSave() {
    this.emotionalBehaviorObj.assId = this.assId;
    this.isLoadingOne = true;
    this.httpReq.post(
      "/jnyyy_assessment_emotional_behavior/saveOrUpdate",
      null,
      this.emotionalBehaviorObj,
      data => {
        this.isLoadingOne = false;
        if (data["code"] == 0) {
          this.msg.success("保存成功");
          this.tabIndex++;
          window.scrollTo(0, 0); // 回到顶部
        }
      }
    );
  }

  addEmotionalBehaviorScore() {
    const sum =
      parseInt(this.emotionalBehaviorObj.emotion) +
      parseInt(this.emotionalBehaviorObj.behavior) +
      parseInt(this.emotionalBehaviorObj.communicateAbility);
    if (sum >= 0 && sum <= 1) {
      this.emotionalBehaviorObj.emotionalBehaviorScore = "正常";
      this.emotionalBehaviorObj.emotionalBehaviorTotalScore = "0";
    } else if (sum > 2 && sum <= 5) {
      this.emotionalBehaviorObj.emotionalBehaviorScore = "轻度异常";
      this.emotionalBehaviorObj.emotionalBehaviorTotalScore = "1";
    } else if (sum > 6 && sum <= 15) {
      this.emotionalBehaviorObj.emotionalBehaviorScore = "中度异常";
      this.emotionalBehaviorObj.emotionalBehaviorTotalScore = "3";
    } else if (sum >= 16) {
      this.emotionalBehaviorObj.emotionalBehaviorScore = "重度异常";
      this.emotionalBehaviorObj.emotionalBehaviorTotalScore = "5";
    } else {
    }
  }

  viewSave() {
    this.viewObj.assId = this.assId;
    this.isLoadingOne = true;
    this.httpReq.post(
      "/jnyyy_assessment_view/saveOrUpdate",
      null,
      this.viewObj,
      data => {
        this.isLoadingOne = false;
        if (data["code"] == 0) {
          this.msg.success("保存成功");
          this.tabIndex++;
          window.scrollTo(0, 0); // 回到顶部

          const sum =
            parseInt(this.viabilityObj.selfAbilityTotalScore) +
            parseInt(this.cognitiveObj.cognitiveAbilityTotalScore) +
            parseInt(this.emotionalBehaviorObj.emotionalBehaviorTotalScore) +
            parseInt(this.viewObj.viewTotalScore);
          this.assessmentSumObj.assessmentTotalScore = sum + "";
          if (sum >= 0 && sum <= 7) {
            this.assessmentSumObj.careAdvice = "自理";
          } else if (sum > 8 && sum <= 21) {
            this.assessmentSumObj.careAdvice = "介助";
          } else if (sum > 22 && sum <= 35) {
            this.assessmentSumObj.careAdvice = "介护";
          } else if (sum >= 36) {
            this.assessmentSumObj.careAdvice = "重度";
          } else {
          }
        }
      }
    );
  }

  addViewScroe() {
    const sum = parseInt(this.viewObj.view);
    if (sum == 0) {
      this.viewObj.viewScore = "正常";
      this.viewObj.viewTotalScore = "0";
    } else if (sum == 18) {
      this.viewObj.viewScore = "中度障碍";
      this.viewObj.viewTotalScore = "18";
    } else if (sum == 30) {
      this.viewObj.viewScore = "重度障碍";
      this.viewObj.viewTotalScore = "30";
    } else {
    }
  }

  // 保存总结
  assessmentSumSave() {
    this.assessmentSumObj.assId = this.assId;
    this.assessmentSumObj.deanAdviceDate =
      this.assessmentSumObj.data +
      "-" +
      this.assessmentSumObj.month +
      "-" +
      this.assessmentSumObj.day +
      " 00:00:00";

    if (this.assessmentSumObj.asser == "") {
      this.msg.error("评估人签字不能为空");
      return;
    }
    if (this.assessmentSumObj.oldmanName == "") {
      this.msg.error("长者签字不能为空");
      return;
    }
    if (this.assessmentSumObj.guardian == "") {
      this.msg.error("监护人/担保人签字不能为空");
      return;
    }
    this.isLoadingOne = true;
    this.httpReq.post(
      "/jnyyy_assessment_sum/saveOrUpdate",
      null,
      this.assessmentSumObj,
      data => {
        this.isLoadingOne = false;
        if (data["code"] == 0) {
          this.msg.success("保存成功");
        }
      }
    );
  }
}
