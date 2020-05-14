import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import * as _ from "underscore"; // JS工具类
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { FormValidService } from "../../../common/service/FormValid.Service";
import { RegexpConfig } from "../../../common/service/GlobalConfig";
import { GlobalMethod } from "../../../common/service/GlobalMethod";
import { Local } from "../../../common/service/Storage";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  abilityAssessBtnArea;
  abilityAssessSaveBtnArea;
  dailyLifeBtnArea;
  dailyLifeSaveBtnArea;
  healthBtnArea;
  healthSaveBtnArea;
  sensoryPerBtnArea;
  sensoryPerSaveBtnArea;
  mentalCondiBtnArea;
  mentalCondiSaveBtnArea;
  asseReportBtnArea;
  asseReportSaveBtnArea;

  public tabIndex: any; // Tab标签页索引值
  public getParam: any; // 传递过来的参数
  public abilityAssessId: any; // 能力评估基本信息表ID
  public abilityAssess: any; // 能力评估基本信息表单对象
  public dailyLife: any; // 日常生活表单对象
  public health: any; // 精神状态表单对象
  public sensoryPer: any; // 感知沟通表单对象
  public mentalCondi: any; // 社会参与表单对象
  public asseReport: any; // 评估报告表单对象
  public finalLevel: any; // 老年人最终护理等级选项

  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private router: Router, // 跳转路由
    private actRoute: ActivatedRoute, // 获取传递的参数
    private fb: FormBuilder, // 响应式表单
    private msg: NzMessageService, // 消息提醒
    private modalService: NzModalService
  ) {}
  isLoadingOne = false;
  gradingData = [];
  loadOne(): void {
    this.isLoadingOne = true;
    setTimeout(_ => {
      this.isLoadingOne = false;
    }, 1000);
  }
  ngOnInit() {
    this.httpReq.post(
      "/dictMgt/listDataByType",
      null,
      { dictType: "old_ability_grade" },
      data => {
        if (data["status"] == 200) {
          if (data["code"] == 0) {
            this.gradingData = data["data"];
          } else {
            this.createMessage("error", data["message"]);
          }
        }
      }
    );
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
    this.dailyLife = {
      // 日常生活表单对象
      oldman_id: "", // 老年人ID
      assessmentDay: [], // 日常生活活动评估表
      totalScore: "100", // 总分
      classification: "0", // 日常生活活动评级
      noteTaker: Local.getObj("UserInfo").name // 记录人
    };

    this.dailyLife.assessmentDay[0] = "10";
    this.dailyLife.assessmentDay[1] = "5";
    this.dailyLife.assessmentDay[2] = "5";
    this.dailyLife.assessmentDay[3] = "10";
    this.dailyLife.assessmentDay[4] = "10";
    this.dailyLife.assessmentDay[5] = "10";
    this.dailyLife.assessmentDay[6] = "10";
    this.dailyLife.assessmentDay[7] = "15";
    this.dailyLife.assessmentDay[8] = "15";
    this.dailyLife.assessmentDay[9] = "10";
    // this.selScore(this.dailyLife.assessmentDay,'dailyLife')
    // this.dailyLife.classification="0";

    this.health = {
      // 精神状态表单对象
      oldman_id: "", // 老年人ID
      assessmentMentality: [], // 精神状态表单对象
      totalScore: "0", // 总分
      classification: "0", // 感知沟通评级
      noteTaker: Local.getObj("UserInfo").name // 记录人
    };
    this.sensoryPer = {
      // 感知沟通表单对象
      oldman_id: "", // 老年人ID
      assessmentCommunication: [], // 感知沟通表单对象
      totalScore: "0", // 总分
      classification: "0", // 感知沟通评级
      noteTaker: Local.getObj("UserInfo").name // 记录人
    };
    this.mentalCondi = {
      // 社会参与表单对象
      oldman_id: "", // 老年人ID
      assessmentSocial: [], // 社会参与表单对象
      totalScore: "0", // 总分
      classification: "0", // 社会参与表评级
      noteTaker: Local.getObj("UserInfo").name // 记录人
    };
    this.asseReport = {
      // 社会参与表单对象
      oldman_id: "", // 老年人ID
      preliminaryGrade: "1", // 老年人能力初步等级
      finalGrade: "", // 老年人能力最终等级
      autographMemo: {
        assess: {
          // 评估员
          name: "",
          date: ""
          // year: "",
          // month: "",
          // day: ""
        },
        provide: {
          // 提供人
          name: "",
          date: ""
          // year: "",
          // month: "",
          // day: ""
        }
      }, // 签名详情
      noteTaker: Local.getObj("UserInfo").name // 记录人
    };

    this.defScoreArr(this.dailyLife.assessmentDay, 10); // 日常生活表单对象
    this.defScoreArr(this.health.assessmentMentality, 3); // 精神状态表单对象
    this.defScoreArr(this.sensoryPer.assessmentCommunication, 4); // 感知沟通表单对象
    this.defScoreArr(this.mentalCondi.assessmentSocial, 5); // 社会参与表单对象

    this.httpReq.get("careLevelCase/allList", null, data => {
      // 获取老年人最终护理等级选项
      // console.log(data);
      if (data["status"] == 200) {
        this.finalLevel = data["data"];
        if (this.finalLevel.length > 0) {
          this.asseReport.finalGrade = this.finalLevel[0].levelName;
        }
      }
    });

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

    if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
      const reqObj: any = {};
      reqObj.oldman_id = this.getParam.id;
      this.httpReq.post("assessmentAppay/findByOldman", null, reqObj, data => {
        // console.log(data);
        if (data["status"] == 200) {
          if (data["data"]["assessmentAppay"]) {
            // 能力评估基本信息表表单对象
            this.abilityAssess.personInfo = this.jsUtil.deepClone(
              data["data"]["assessmentAppay"]["oldman"]
            );
            this.abilityAssess.assCode =
              data["data"]["assessmentAppay"]["assCode"];
            this.abilityAssess.assDate =
              data["data"]["assessmentAppay"]["assDate"];
            this.abilityAssess.assReason =
              data["data"]["assessmentAppay"]["assReason"];
            this.abilityAssess.asser = data["data"]["assessmentAppay"]["asser"];
            this.abilityAssessId = data["data"]["assessmentAppay"]["id"]; // 能力评估基本信息表ID
          }

          if (data["data"]["assessmentAppayMemo"]) {
            if (data["data"]["assessmentAppayMemo"]["assessmentDay"]) {
              this.dailyLife.assessmentDay = JSON.parse(
                data["data"]["assessmentAppayMemo"]["assessmentDay"]
              ); // 日常生活表单对象
              this.dailyLife.noteTaker = Local.getObj("UserInfo").name;
              this.selScore(this.dailyLife.assessmentDay, "dailyLife");
            }

            if (data["data"]["assessmentAppayMemo"]["assessmentMentality"]) {
              this.health.assessmentMentality = JSON.parse(
                data["data"]["assessmentAppayMemo"]["assessmentMentality"]
              ); // 精神状态表单对象
              this.health.noteTaker = Local.getObj("UserInfo").name;
              this.selScore(this.health.assessmentMentality, "health");
            }

            if (
              data["data"]["assessmentAppayMemo"]["assessmentCommunication"]
            ) {
              this.sensoryPer.assessmentCommunication = JSON.parse(
                data["data"]["assessmentAppayMemo"]["assessmentCommunication"]
              );
              // 感知沟通表单对象
              this.sensoryPer.noteTaker = Local.getObj("UserInfo").name;
              this.selScore(
                this.sensoryPer.assessmentCommunication,
                "sensoryPer"
              );
            }

            if (data["data"]["assessmentAppayMemo"]["assessmentSocial"]) {
              this.mentalCondi.assessmentSocial = JSON.parse(
                data["data"]["assessmentAppayMemo"]["assessmentSocial"]
              ); // 社会参与表单对象
              this.mentalCondi.noteTaker = Local.getObj("UserInfo").name;
              this.selScore(this.mentalCondi.assessmentSocial, "mentalCondi");
            }
          }

          if (data["data"]["assessmentAssreport"]) {
            this.asseReport.preliminaryGrade = data["data"][
              "assessmentAssreport"
            ]["preliminaryGrade"].toString(); // 老年人能力初步等级

            this.asseReport.autographMemo = JSON.parse(
              data["data"]["assessmentAssreport"]["autographMemo"]
            ); // 评估报告
            this.asseReport.noteTaker = Local.getObj("UserInfo").name;

            this.asseReport.finalGrade =
              data["data"]["assessmentAssreport"]["finalGrade"]; // 老年人能力最终等级
            this.asseReport.id = data["data"]["assessmentAssreport"]["id"]; // 评估报告
          }
        }
      });
    } else {
      that.msg.warning("未获取到ID");
      that.jumpPage("../../");
    }

    // console.log(this.actRoute.snapshot.paramMap["params"]);
  }
  createMessage(type: string, mess: string): void {
    this.msg.create(type, `${mess}`);
  }
  /**
   * 初始化分数组组
   * @param {Array<string>} arr 传入要初始化的数组
   * @param {number} frequ 循环次数
   * @memberof AddComponent
   */
  public defScoreArr(arr: Array<string>, frequ: number) {
    for (let i = 0; i < frequ; i++) {
      arr.push("0");
    }
  }

  /**
   * 改变路由跳转页面
   * @param {string} url 相对路由或绝对路径 ex:'info'或'../info'或'/nursingHome/medical'
   * @param {*} paramObj 要传递的参数信息
   */
  public jumpPage(url: string, param?: any): void {
    if (param) {
      GlobalMethod.changeRoute(url, this.router, this.actRoute, param);
    } else {
      GlobalMethod.changeRoute(url, this.router, this.actRoute);
    }
  }

  /**
   * 单击返回按钮
   * @memberof ConsultAddComponent
   */
  public clickBack() {
    this.jumpPage("../../"); // 返回上一级
    // window.history.back(); // 调用浏览器window对象返回方法
  }

  /**
   * 选择分数
   * @param {*} formArr 要计算的表对象数组
   * @param {string} type 表的类型
   * @memberof AddComponent
   */
  selScore(formArr: any, type: string) {
    if (type == "dailyLife") {
      // 日常生活表单对象
      this.dailyLife.totalScore = GlobalMethod.arrSum(formArr);
      const scoreSum = this.dailyLife.totalScore;
      if (scoreSum <= 40) {
        this.dailyLife.classification = "3"; // 3重度受损
      } else if (scoreSum >= 45 && scoreSum <= 60) {
        this.dailyLife.classification = "2"; // 2中度受损
      } else if (scoreSum >= 65 && scoreSum <= 95) {
        this.dailyLife.classification = "1"; // 1轻度受损
      } else if (scoreSum >= 100) {
        this.dailyLife.classification = "0"; // 0能力完好
      }
    } else if (type == "health") {
      // 精神状态表单对象
      this.health.totalScore = GlobalMethod.arrSum(formArr);
      const scoreSum = this.health.totalScore;
      if (scoreSum >= 4 && scoreSum <= 6) {
        this.health.classification = "3"; // 3重度受损
      } else if (scoreSum >= 2 && scoreSum <= 3) {
        this.health.classification = "2"; // 2中度受损
      } else if (scoreSum == 1) {
        this.health.classification = "1"; // 1轻度受损
      } else if (scoreSum == 0) {
        this.health.classification = "0"; // 0能力完好
      }
    } else if (type == "sensoryPer") {
      // 感知沟通表单对象
      this.judgeLevel(); // 判断分级
    } else if (type == "mentalCondi") {
      // 社会参与表单对象
      this.mentalCondi.totalScore = GlobalMethod.arrSum(formArr);
      const scoreSum = this.mentalCondi.totalScore;
      if (scoreSum >= 14 && scoreSum <= 20) {
        this.mentalCondi.classification = "3"; // 3重度受损
      } else if (scoreSum >= 8 && scoreSum <= 13) {
        this.mentalCondi.classification = "2"; // 2中度受损
      } else if (scoreSum >= 3 && scoreSum <= 7) {
        this.mentalCondi.classification = "1"; // 1轻度受损
      } else if (scoreSum >= 0 && scoreSum <= 2) {
        this.mentalCondi.classification = "0"; // 0能力完好
      }
    } else if (type == "asseReport") {
      // 评估报告表单对象
      this.judgeOldManLevel(); // 判断老年人能力初步等级
    }
    this.judgeOldManLevel(); // 判断老年人能力初步等级
  }

  /**
   * 判断感知觉与沟通评级
   * @memberof AddComponent
   */
  judgeLevel() {
    const spirit = parseInt(this.sensoryPer.assessmentCommunication[0]); // 精神
    const vision = parseInt(this.sensoryPer.assessmentCommunication[1]); // 视力
    const hearing = parseInt(this.sensoryPer.assessmentCommunication[2]); // 听力
    const communicate = parseInt(this.sensoryPer.assessmentCommunication[3]); // 沟通
    if (
      spirit == 0 &&
      (vision == 0 || vision == 1) &&
      (hearing == 0 || hearing == 1) &&
      communicate == 0
    ) {
      // 能力完好
      this.sensoryPer.classification = "0";
    } else if (
      spirit == 0 &&
      (vision == 2 || hearing == 2 || communicate == 1)
    ) {
      // 轻度受损
      this.sensoryPer.classification = "1";
    } else if (
      spirit == 0 &&
      (vision == 3 || hearing == 3 || communicate == 2)
    ) {
      // 中度受损
      this.sensoryPer.classification = "2";
    } else if (
      (spirit == 0 || spirit == 1) &&
      (vision == 4 || hearing == 4 || communicate == 3)
    ) {
      // 重度受损
      console.log(`重度受损${spirit}--${vision}--${hearing}--${communicate}`);
      this.sensoryPer.classification = "3";
    } else if (
      spirit == 1 &&
      (vision <= 3 || hearing <= 3) &&
      communicate <= 2
    ) {
      // 中度受损
      console.log(`中度受损${spirit}--${vision}--${hearing}--${communicate}`);
      this.sensoryPer.classification = "2";
    } else if (spirit == 2 || spirit == 3) {
      // 重度受损
      console.log(`重度受损${spirit}--${vision}--${hearing}--${communicate}`);
      this.sensoryPer.classification = "3";
    } else {
      console.log(`error${spirit}--${vision}--${hearing}--${communicate}`);
    }
  }

  /**
   * 判断老年人能力初步等级
   * @memberof AddComponent
   */
  judgeOldManLevel() {
    const dayLevel = parseInt(this.dailyLife.classification); // 日常生活活动评级
    const heaLevel = parseInt(this.health.classification); // 精神状况评级
    const senLevel = parseInt(this.sensoryPer.classification); // 感知觉与沟通评级
    const menLevel = parseInt(this.mentalCondi.classification); // 社会参与评级

    if (
      dayLevel == 0 &&
      heaLevel == 0 &&
      senLevel == 0 &&
      (menLevel == 0 || menLevel == 1)
    ) {
      console.log("能力完好");
      this.asseReport.preliminaryGrade = "0";
    } else if (
      dayLevel == 0 &&
      (heaLevel == 1 || senLevel == 1 || menLevel == 2)
    ) {
      console.log("轻度失能");
      this.asseReport.preliminaryGrade = "1";
    } else if (
      dayLevel == 1 &&
      (heaLevel == 0 ||
        senLevel == 0 ||
        menLevel == 0 ||
        heaLevel == 1 ||
        senLevel == 1 ||
        menLevel == 1)
    ) {
      console.log("轻度失能");
      this.asseReport.preliminaryGrade = "1";
    } else if (
      dayLevel == 1 &&
      heaLevel == 2 &&
      senLevel == 2 &&
      menLevel == 2
    ) {
      console.log("中度失能");
      this.asseReport.preliminaryGrade = "2";
    } else if (
      dayLevel == 1 &&
      (heaLevel == 3 || senLevel == 3 || menLevel == 3)
    ) {
      console.log("中度失能");
      this.asseReport.preliminaryGrade = "2";
    } else if (
      dayLevel == 2 &&
      (heaLevel == 1 || senLevel == 1 || menLevel == 1)
    ) {
      console.log("中度失能");
      this.asseReport.preliminaryGrade = "2";
    } else if (
      dayLevel == 2 &&
      ((heaLevel == 2 && senLevel == 2) ||
        (heaLevel == 2 && menLevel == 2) ||
        (menLevel == 2 && senLevel == 2))
    ) {
      console.log("中度失能");
      this.asseReport.preliminaryGrade = "2";
    } else if (
      dayLevel == 3 ||
      (dayLevel == 2 && heaLevel == 2 && senLevel == 2 && menLevel == 2) ||
      (dayLevel == 3 && (heaLevel == 3 || senLevel == 3 || menLevel == 3))
    ) {
      console.log("重度失能");
      this.asseReport.preliminaryGrade = "3";
    }
  }

  /**
   * Tab标签页点击事件
   * @param {*} ev
   * @memberof AddComponent
   */
  public clickTab(ev: any) {
    // console.log(ev.index);
  }

  /**
   * 保存表单数据
   * @param {string} type 保存的表单类型
   * //dailyLife 日常生活表单对象
   * //health 精神状态表单对象
   * //sensoryPer 感知沟通表单对象
   * //mentalCondi 社会参与表单对象
   * //asseReport 评估报告表单对象
   * @returns
   * @memberof AddComponent
   */
  showDeleteConfirm(type, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.del(() => {
      this.saveForm(type);
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
  public saveForm(type: string) {
    this.loadOne();
    const that = this;

    if (type == "abilityAssess") {
      // 能力评估基本信息表单对象
      const formData = this.jsUtil.deepClone(this.abilityAssess); // 深度拷贝表单数据
      if (_.isString(this.getParam.id) && this.getParam.id.length > 0) {
        formData.oldman_id = this.getParam.id;
        formData.assDate = this.jsUtil.dateFormat(formData.assDate);
        if (this.abilityAssessId) {
          // 编辑
          formData.id = this.abilityAssessId;
          formData.modifier = Local.getObj("UserInfo").name;
          this.httpReq.post("assessmentAppay/edit", null, formData, data => {
            // console.log(data);
            if (data["status"] == 200) {
              if (data["code"] === 0) {
                that.msg.success("保存成功");
                this.tabIndex++;
                window.scrollTo(0, 0); // 回到顶部
                // console.log(this.tabIndex);
              } else {
                that.msg.warning(data["message"]);
              }
            }
          });
        } else {
          // 保存
          this.httpReq.post("assessmentAppay/save", null, formData, data => {
            if (data["status"] == 200) {
              this.abilityAssessId = data["data"]["id"];
              if (data["code"] === 0) {
                that.msg.success("保存成功");
                this.tabIndex++;
                window.scrollTo(0, 0); // 回到顶部
                // console.log(this.tabIndex);
              } else {
                that.msg.warning(data["message"]);
              }
            }
          });
        }
      }
      // console.log(formData);
    } else if (type == "dailyLife") {
      //日常生活表单对象
      const formData = this.jsUtil.deepClone(this.dailyLife); // 深度拷贝表单数据
      if (_.isString(this.abilityAssessId) && this.abilityAssessId.length > 0) {
        formData.assessmentAppay_Id = this.abilityAssessId;
        this.httpReq.post(
          "assessmentAppay/saveAssessmentDay",
          null,
          formData,
          data => {
            if (data["status"] == 200) {
              if (data["code"] === 0) {
                that.msg.success("保存成功");
                this.tabIndex++;
                window.scrollTo(0, 0); // 回到顶部
              } else {
                that.msg.warning(data["message"]);
              }
            }
          }
        );
      }
    } else if (type == "health") {
      // 精神状态表单对象
      const formData = this.jsUtil.deepClone(this.health); // 深度拷贝表单数据
      if (_.isString(this.abilityAssessId) && this.abilityAssessId.length > 0) {
        formData.assessmentAppay_Id = this.abilityAssessId;
        this.httpReq.post(
          "assessmentAppay/saveAssessmentMentality",
          null,
          formData,
          data => {
            if (data["status"] == 200) {
              if (data["code"] === 0) {
                that.msg.success("保存成功");
                this.tabIndex++;
                window.scrollTo(0, 0); // 回到顶部
              } else {
                that.msg.warning(data["message"]);
              }
            }
          }
        );
      }
    } else if (type == "sensoryPer") {
      // 感知沟通表单对象
      const formData = this.jsUtil.deepClone(this.sensoryPer); // 深度拷贝表单数据
      if (_.isString(this.abilityAssessId) && this.abilityAssessId.length > 0) {
        formData.assessmentAppay_Id = this.abilityAssessId;
        this.httpReq.post(
          "assessmentAppay/saveAssessmentCommunication",
          null,
          formData,
          data => {
            if (data["status"] == 200) {
              if (data["code"] === 0) {
                that.msg.success("保存成功");
                this.tabIndex++;
                window.scrollTo(0, 0); // 回到顶部
              } else {
                that.msg.warning(data["message"]);
              }
            }
          }
        );
      }
    } else if (type == "mentalCondi") {
      // 社会参与表单对象
      const formData = this.jsUtil.deepClone(this.mentalCondi); // 深度拷贝表单数据
      if (_.isString(this.abilityAssessId) && this.abilityAssessId.length > 0) {
        formData.assessmentAppay_Id = this.abilityAssessId;
        this.httpReq.post(
          "assessmentAppay/saveAssessmentSocial",
          null,
          formData,
          data => {
            if (data["status"] == 200) {
              if (data["code"] === 0) {
                that.msg.success("保存成功");
                this.tabIndex++;
                window.scrollTo(0, 0); // 回到顶部
              } else {
                that.msg.warning(data["message"]);
              }
            }
          }
        );
      }
    } else if (type == "asseReport") {
      // 评估报告表单对象
      const formData = this.jsUtil.deepClone(this.asseReport); // 深度拷贝表单数据
      if (_.isString(this.abilityAssessId) && this.abilityAssessId.length > 0) {
        formData.assessmentAppay_Id = this.abilityAssessId;

        formData.autographMemo.assess.date = this.jsUtil.dateFormat(
          formData.autographMemo.assess.date
        );
        formData.autographMemo.provide.date = this.jsUtil.dateFormat(
          formData.autographMemo.provide.date
        );

        formData.asser = formData.autographMemo.assess.name; // 评估人
        formData.assDate = formData.autographMemo.assess.date; // 评估时间
        if (formData.assDate == "") {
          that.msg.warning("请填写评估日期");
        } else {
          if (this.asseReport.id) {
            // 编辑
            formData.id = this.asseReport.id;
            formData.modifier = Local.getObj("UserInfo").name;
            this.httpReq.post(
              "assessmentAppay/editAssessmentAssreport",
              null,
              formData,
              data => {
                if (data["status"] == 200) {
                  if (data["code"] === 0) {
                    that.msg.success("保存成功");
                    this.clickBack(); // 返回列表
                    // this.tabIndex++;
                  } else {
                    that.msg.warning(data["message"]);
                  }
                }
              }
            );
          } else {
            // 添加
            this.httpReq.post(
              "assessmentAppay/saveAssessmentAssreport",
              null,
              formData,
              data => {
                if (data["status"] == 200) {
                  if (data["code"] === 0) {
                    that.msg.success("保存成功");
                    this.clickBack(); // 返回列表
                    // this.tabIndex++;
                  } else {
                    that.msg.warning(data["message"]);
                  }
                }
              }
            );
          }
        }
      }
    }
  }
}
