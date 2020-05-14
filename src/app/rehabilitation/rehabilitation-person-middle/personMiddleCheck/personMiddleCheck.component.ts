import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from "@angular/router";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { FormBuilder } from "@angular/forms";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";

class personMiddle {
  startDate: string;
  endDate: string;
  trainItems: object;
  trainProcess: string;
  trainExistProblem: string;
  moreCureMeasure: string;
  recureAttention: string;
}

@Component({
  selector: "app-personMiddleCheck",
  templateUrl: "./personMiddleCheck.component.html",
  styleUrls: ["./personMiddleCheck.component.css"]
})
export class PersonMiddleCheckComponent implements OnInit {
  interimDisabledNumber = true;
  telocinesiaDisabledNumber = true;
  tabIndex = 0;
  constructor(
    private httpService: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private fb: FormBuilder,
    private message: NzMessageService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService
  ) {}

  savePersonalBtnLoading = false;
  userInfo;
  personFinal = {
    name: "",
    id: "",
    recureName: "",
    applyDate: "",
    sex: "",
    age: "",
    education: "",
    bed: "",
    careLevel: ""
  };

  // 初期保存参数
  personFinalSave = {
    id: "",
    recureCaseId: "",
    recureTrainer: "",
    applyDate: "",
    illnessSummary: "",
    clinicalDiagnosis: "",
    majorRecureProblem: "",
    shortTermGoal: "",
    midTermGoal: "",
    longTermGoal: "",
    recurePlan: "",
    recureNotes: "",
    therapeutist: "",
    recureDoctor: "",
    comment: "",
    accountId: ""
  };

  // 中期的保存参数
  personMiddleSave = {
    id: "",
    recureCaseId: "",
    recureTrainer: "",
    evaluateDate: "",
    therapeutist: "",
    recureDoctor: "",
    comment: "",
    accountId: "",
    recurePlans: []
  };

  personMiddleSaveItem = {
    startDate: "",
    endDate: "",
    trainItems: [],
    trainProcess: "",
    trainExistProblem: "",
    moreCureMeasure: "",
    recureAttention: ""
  };

  personFinalLastSave = {
    id: "",
    recureCaseId: "",
    recureTrainer: "",
    evaluateDate: "",
    mainTrainProblem: "",
    achievedEffect: "",
    existProblem: "",
    continueAdviceGuide: "",
    therapeutist: "",
    recureDoctor: "",
    comment: "",
    accountId: ""
  };

  selectData = [];
  getId; //获得个案ID获得信息
  details;
  recureFlag;
  ngOnInit() {
    // this.getRehabilitationDate();//调用康复项目列表
    // 编辑时获得的信息
    const recureCaseId = this.route.snapshot.paramMap.get("recureCaseId");
    const recureFlag = this.route.snapshot.paramMap.get("recureFlag");
    this.recureFlag = recureFlag;

    if (recureFlag == "1") {
      this.interimDisabledNumber = false;
    } else if (recureFlag == "2" || recureFlag == "3") {
      this.interimDisabledNumber = false;
      this.telocinesiaDisabledNumber = false;
    } else {
      this.interimDisabledNumber = true;
      this.telocinesiaDisabledNumber = true;
    }

    if (recureFlag == "0") {
      this.personFinalSave.id = "";
      this.personFinalSave.recureCaseId = recureCaseId;
      this.details = "康复训练初期评价单";
    } else {
      this.getId = recureCaseId;
      this.getInitialList();
      this.personFinalSave.recureCaseId = recureCaseId;
    }

    this.getMiddItemList();
    if (recureFlag == "1") {
      this.personMiddleSave.id = "";
      this.personMiddleSave.recureCaseId = recureCaseId;
      this.details = "康复计划评价单";
    } else if (recureFlag == "2" || recureFlag == "3") {
      this.getId = recureCaseId;
      this.getMiddleList();
      this.personMiddleSave.recureCaseId = recureCaseId;
    }

    if (recureFlag == "2") {
      this.personFinalLastSave.id = "";
      this.personFinalLastSave.recureCaseId = recureCaseId;
      this.details = "康复训练末期评价单";
    } else if (recureFlag == "3") {
      this.getLastList();
      this.getId = recureCaseId;
      this.personFinalLastSave.recureCaseId = recureCaseId;
    }

    // 获得个人信息  accountId
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    this.personFinalSave.accountId = this.userInfo.id;
    this.personMiddleSave.accountId = this.userInfo.id;
    this.personFinalLastSave.accountId = this.userInfo.id;
  }
  // 通过个案的ID获得初期的数据
  getInitialList() {
    const that = this;
    this.httpReq.post(
      "/rcInitEvaluation/listByCase",
      null,
      { recureCaseId: this.getId },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const personFinalSaveData = data["data"];
            this.personFinalSave.applyDate = personFinalSaveData.applyDate;
            this.personFinalSave.recureTrainer =
              personFinalSaveData.recureTrainer;
            this.personFinalSave.illnessSummary =
              personFinalSaveData.illnessSummary;
            this.personFinalSave.clinicalDiagnosis =
              personFinalSaveData.clinicalDiagnosis;
            this.personFinalSave.majorRecureProblem =
              personFinalSaveData.majorRecureProblem;
            this.personFinalSave.shortTermGoal =
              personFinalSaveData.shortTermGoal;
            this.personFinalSave.midTermGoal = personFinalSaveData.midTermGoal;
            this.personFinalSave.longTermGoal =
              personFinalSaveData.longTermGoal;
            this.personFinalSave.recurePlan = personFinalSaveData.recurePlan;
            this.personFinalSave.recureNotes = personFinalSaveData.recureNotes;
            this.personFinalSave.therapeutist =
              personFinalSaveData.therapeutist;
            this.personFinalSave.recureDoctor =
              personFinalSaveData.recureDoctor;
            this.personFinalSave.comment = personFinalSaveData.comment;
            this.personFinalSave.id = personFinalSaveData.id;
            that.personFinal = data["data"].recureCase;
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }

  // 通过个案的ID获得中期的数据
  getMiddleList() {
    const that = this;
    this.httpReq.post(
      "/rcMidEvaluation/listByCase",
      null,
      { recureCaseId: this.getId },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const dataInfo = data["data"];
            that.personMiddleSave.recureTrainer = dataInfo.recureTrainer;
            that.personMiddleSave.evaluateDate = dataInfo.evaluateDate;
            that.personMiddleSave.therapeutist = dataInfo.therapeutist;
            that.personMiddleSave.recureDoctor = dataInfo.recureDoctor;
            that.personMiddleSave.comment = dataInfo.comment;
            that.personMiddleSave.recurePlans = dataInfo.recurePlanList;

            this.personMiddleSave.id = dataInfo.id;
            that.personFinal = data["data"].recureCase;
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }

  // 通过个案的ID获得中期的数据
  getLastList() {
    const that = this;
    this.httpReq.post(
      "/rcFinalEvaluation/listByCase",
      null,
      { recureCaseId: this.getId },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const dataInfo = data["data"];
            that.personFinalLastSave.recureTrainer = dataInfo.recureTrainer;
            that.personFinalLastSave.evaluateDate = dataInfo.evaluateDate;
            that.personFinalLastSave.mainTrainProblem =
              dataInfo.mainTrainProblem;
            that.personFinalLastSave.achievedEffect = dataInfo.achievedEffect;
            that.personFinalLastSave.existProblem = dataInfo.existProblem;
            that.personFinalLastSave.continueAdviceGuide =
              dataInfo.continueAdviceGuide;
            that.personFinalLastSave.therapeutist = dataInfo.therapeutist;
            that.personFinalLastSave.recureDoctor = dataInfo.recureDoctor;
            that.personFinalLastSave.existProblem = dataInfo.existProblem;
            that.personFinalLastSave.comment = dataInfo.comment;

            this.personFinalLastSave.id = dataInfo.id;
            that.personFinal = data["data"].recureCase;
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }
  trainItems = undefined;
  rehabilitationDate = [];
  // 获得康复项目离别
  getMiddItemList() {
    const that = this;
    this.httpReq.post(
      "/rcMidEvaluation/listRecureItemData",
      null,
      { recureCaseId: this.getId },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            const middItemList = JSON.parse(data["data"]);

            middItemList.forEach(e => {
              let parse = {
                label: "",
                value: ""
              };
              parse.label = e.tag;
              parse.value = e.tag;
              this.rehabilitationDate.push(parse);
            });
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }
  onSavePersonalInitial() {
    // this.personFinalSave.recureCaseId=this.personFinal.id;
    // this.personFinalSave.accountId=this.getId;
    this.httpReq.post(
      "rcInitEvaluation/saveOrUpdate",
      null,
      this.personFinalSave,
      data => {
        this.savePersonalBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            if (this.recureFlag == "0") {
              this.back();
            } else {
              this.tabIndex++;
              window.scroll(0, 0);
            }
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }

  onSavePersonMiddle() {
    this.httpReq.post(
      "rcMidEvaluation/saveOrUpdate",
      null,
      this.personMiddleSave,
      data => {
        this.savePersonalBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            if (this.recureFlag == "1") {
              this.back();
            } else if (this.recureFlag == "2") {
              this.tabIndex++;
              window.scroll(0, 0);
            }
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }

  onSavePersonLast() {
    this.httpReq.post(
      "/rcFinalEvaluation/saveOrUpdate",
      null,
      this.personFinalLastSave,
      data => {
        this.savePersonalBtnLoading = false;
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.message.success("保存成功！");
            if (this.recureFlag == "2") {
              this.back();
            }
          } else {
            this.message.error(data.message);
          }
        }
      }
    );
  }
  isVisible = false;
  addRehabilitation() {
    this.isVisible = true;
    this.personMiddleSaveItem.startDate = "";
    this.personMiddleSaveItem.endDate = "";
    this.personMiddleSaveItem.trainItems = [];
    this.personMiddleSaveItem.trainProcess = "";
    this.personMiddleSaveItem.trainExistProblem = "";
    this.personMiddleSaveItem.moreCureMeasure = "";
    this.personMiddleSaveItem.recureAttention = "";
  }

  handleCancel() {
    this.isVisible = false;
    this.number = "";
  }

  public clickTab(ev: any) {
    console.log(ev.index);
  }
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }
  back() {
    history.back();
  }

  // 保存康复项目
  saveItem() {
    let index;
    if (this.number != "") {
      index = parseInt(this.number) - 1;
      this.number = "";
      let d = new Date(this.personMiddleSaveItem.startDate);
      this.personMiddleSaveItem.startDate =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();

      let end = new Date(this.personMiddleSaveItem.endDate);
      this.personMiddleSaveItem.endDate =
        end.getFullYear() +
        "-" +
        (end.getMonth() + 1) +
        "-" +
        end.getDate() +
        " " +
        end.getHours() +
        ":" +
        end.getMinutes() +
        ":" +
        end.getSeconds();

      this.personMiddleSave.recurePlans[
        index
      ].startDate = this.personMiddleSaveItem.startDate;
      this.personMiddleSave.recurePlans[
        index
      ].endDate = this.personMiddleSaveItem.startDate;
      this.personMiddleSave.recurePlans[
        index
      ].trainItems = this.personMiddleSaveItem.trainItems;

      this.personMiddleSave.recurePlans[
        index
      ].trainExistProblem = this.personMiddleSaveItem.trainExistProblem;
      this.personMiddleSave.recurePlans[
        index
      ].moreCureMeasure = this.personMiddleSaveItem.moreCureMeasure;
      this.personMiddleSave.recurePlans[
        index
      ].recureAttention = this.personMiddleSaveItem.recureAttention;
      this.handleCancel();
    } else {
      let newItem = new personMiddle();
      let d = new Date(this.personMiddleSaveItem.startDate);
      newItem.startDate =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();

      let end = new Date(this.personMiddleSaveItem.endDate);
      newItem.endDate =
        end.getFullYear() +
        "-" +
        (end.getMonth() + 1) +
        "-" +
        end.getDate() +
        " " +
        end.getHours() +
        ":" +
        end.getMinutes() +
        ":" +
        end.getSeconds();

      newItem.trainItems = this.personMiddleSaveItem.trainItems;
      newItem.trainProcess = this.personMiddleSaveItem.trainProcess;
      newItem.trainExistProblem = this.personMiddleSaveItem.trainExistProblem;
      newItem.moreCureMeasure = this.personMiddleSaveItem.moreCureMeasure;
      newItem.recureAttention = this.personMiddleSaveItem.recureAttention;
      this.personMiddleSave.recurePlans = [
        ...this.personMiddleSave.recurePlans,
        newItem
      ];
      this.handleCancel();
    }
  }

  // 删除康复项目列表
  delete(i: personMiddle, e: MouseEvent): void {
    e.preventDefault();
    if (this.personMiddleSave.recurePlans.length > 0) {
      this.personMiddleSave.recurePlans = this.personMiddleSave.recurePlans.filter(
        d => d !== i
      );
    }
  }
  number = "";
  turnToEdit(number, data, e?: MouseEvent) {
    this.number = number + 1;
    if (e) {
      e.preventDefault();
    }
    this.isVisible = true;
    this.personMiddleSaveItem.startDate = data.startDate;
    this.personMiddleSaveItem.endDate = data.endDate;
    if (typeof data.trainItems == "string") {
      this.personMiddleSaveItem.trainItems = Utils.isNotEmpty(data.trainItems)
        ? JSON.parse(data.trainItems)
        : [];
    }
    this.personMiddleSaveItem.trainProcess = data.trainProcess;
    this.personMiddleSaveItem.trainExistProblem = data.trainExistProblem;
    this.personMiddleSaveItem.moreCureMeasure = data.moreCureMeasure;
    this.personMiddleSaveItem.recureAttention = data.recureAttention;
  }

  endOpen: boolean = false;
  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }
  startValue: Date = null;
  endValue: Date = null;
  onStartChange(date: Date): void {
    this.startValue = date;
  }

  onEndChange(date: Date): void {
    this.endValue = date;
  }
}
