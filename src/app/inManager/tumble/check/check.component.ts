import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { ENgxPrintComponent } from "e-ngx-print";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-check",
  templateUrl: "./check.component.html",
  styleUrls: ["./check.component.scss"]
})
export class CheckComponent implements OnInit {
  user;
  //保存按钮状态
  saveBtnLoading = false;

  // 老年人信息
  olderInfo = {
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
    phone: "",
    education: ""
  };

  tumbleInfo = {
    assessmentDate: "",
    adjuster: "",
    diagnose: "",
    muscleWeakness: "",
    balanceCoordination: "",
    ageAndSex: "",
    nutrition: "",
    chronicDisease: "",
    fracture: "",
    sleep: "",
    vision: "",
    drugFactors: "",
    equipment: "",
    historyOfFalls: "",
    chaperonage: "",
    total: "",
    grade: "",
    signatureName: "",
    signatureDate: "",
    date: ""
  };

  saveInfo = {
    id: "",
    fallMemo: "",
    oldman_id: "",
    noteTaker: "",
    modifier: "",
    asser: "",
    assDate: "",
    totalScore: "",
    fallResults: ""
  };

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
  //老年人选择对话框检索
  searchOldName = "";
  //是否显示选择老年人对话框
  isShowOldDialog = false;
  //老年人列表table加载状态
  isOldTableLoading = false;
  oldDataArray = [];
  oldResultData = {
    totalElements: 0
  };
  disabled = false;
  @ViewChild("print") printComponent: ENgxPrintComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    let that = this;
    that.gradeChange();
    this.route.params.subscribe((params: Params) => {
      const infoStr = params["info"];
      if (infoStr != "{}") {
        let info = JSON.parse(infoStr);
        that.olderInfo = info.oldman;
        that.saveInfo.id = info.id;
        that.saveInfo.oldman_id = info.oldman.id;
        that.saveInfo.asser = info.asser;
        that.saveInfo.noteTaker = info.noteTaker;
        that.saveInfo.modifier = info.modifier;
        that.saveInfo.assDate = info.assDate;
        that.saveInfo.totalScore = info.totalScore;
        that.saveInfo.fallResults = info.fallResults;
        that.saveInfo.fallMemo = info.fallMemo;
        that.tumbleInfo = JSON.parse(info.fallMemo);
        // that.tumbleInfo.total=info.fallMemo.total
      }
    });
  }

  isPrintNow = false;
  onPrint(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.disabled = true;
    this.isPrintNow = true;
    this.printComponent.print();
  }

  printComplete() {
    this.isPrintNow = false;
    this.disabled = false;
  }
  back() {
    history.back();
  }

  /**
   * 取消显示选择老年人对话框
   */
  cancelOldDialog() {
    this.isShowOldDialog = false;
  }

  /**
   * 显示老年人选择对话框，并加载老年人列表
   */
  showOldDialog(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowOldDialog = true;
    this.loadingOldList();
  }
  /**
   * 老年人选择对话框中选择了某个老年人；
   */
  chooseOld(oldInfo) {
    this.olderInfo = oldInfo;
    this.isShowOldDialog = false;
    this.saveInfo.oldman_id = this.olderInfo.id;
  }
  /**
   * 加载老年人列表
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

  onSave() {
    if (Utils.isEmpty(this.saveInfo.oldman_id)) {
      this.message.error("请选择需要评估的老年人!");
      return;
    }
    this.tumbleInfo.assessmentDate = this.formatDate(
      this.tumbleInfo.assessmentDate
    );
    this.tumbleInfo.signatureDate = this.formatDate(
      this.tumbleInfo.signatureDate
    );

    this.saveInfo.fallMemo = JSON.stringify(this.tumbleInfo);
    this.tumbleInfo.adjuster = this.saveInfo.asser;
    this.tumbleInfo.assessmentDate = this.saveInfo.assDate;
    // this.saveInfo.asser = this.tumbleInfo.adjuster;
    // this.saveInfo.assDate = this.tumbleInfo.assessmentDate;
    this.saveInfo.totalScore = this.tumbleInfo.total;
    this.saveInfo.fallResults = this.getAssResult(this.tumbleInfo.total);

    this.saveBtnLoading = true;
    let that = this;
    if (Utils.isEmpty(that.saveInfo.id)) {
      this.user = this.localStorage.getUser();
      this.saveInfo.noteTaker = this.user.data.name;
      let param = this.httpReq.post(
        "assessmentFall/save",
        null,
        this.saveInfo,
        data => {
          that.saveBtnLoading = false;
          if (data["status"] == 200) {
            that.message.success("保存成功！");
            that.back();
          }
        }
      );
    } else {
      this.user = this.localStorage.getUser();
      this.saveInfo.modifier = this.user.data.name;
      let param = this.httpReq.post(
        "assessmentFall/edit",
        null,
        this.saveInfo,
        data => {
          that.saveBtnLoading = false;
          if (data["status"] == 200) {
            that.message.success("保存成功！");
            that.back();
          }
        }
      );
    }
  }

  /**
   * 格式化日期
   */
  formatDate(date: string): string {
    if (date == null || date == undefined || date == "") {
      return "";
    }
    let dateNow = new Date(date);
    let year: number = dateNow.getFullYear();
    let month: string | number = dateNow.getMonth() + 1;
    let day: string | number = dateNow.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  }

  gradeChange() {
    let that = this;
    setTimeout(() => {
      let total =
        parseInt(
          that.tumbleInfo.muscleWeakness == ""
            ? "0"
            : that.tumbleInfo.muscleWeakness
        ) +
        parseInt(
          that.tumbleInfo.balanceCoordination == ""
            ? "0"
            : that.tumbleInfo.balanceCoordination
        ) +
        parseInt(
          that.tumbleInfo.ageAndSex == "" ? "0" : that.tumbleInfo.ageAndSex
        ) +
        parseInt(
          that.tumbleInfo.nutrition == "" ? "0" : that.tumbleInfo.nutrition
        ) +
        parseInt(
          that.tumbleInfo.chronicDisease == ""
            ? "0"
            : that.tumbleInfo.chronicDisease
        ) +
        parseInt(
          that.tumbleInfo.fracture == "" ? "0" : that.tumbleInfo.fracture
        ) +
        parseInt(that.tumbleInfo.sleep == "" ? "0" : that.tumbleInfo.sleep) +
        parseInt(that.tumbleInfo.vision == "" ? "0" : that.tumbleInfo.vision) +
        parseInt(
          that.tumbleInfo.drugFactors == "" ? "0" : that.tumbleInfo.drugFactors
        ) +
        parseInt(
          that.tumbleInfo.equipment == "" ? "0" : that.tumbleInfo.equipment
        ) +
        parseInt(
          that.tumbleInfo.historyOfFalls == ""
            ? "0"
            : that.tumbleInfo.historyOfFalls
        ) +
        parseInt(
          that.tumbleInfo.chaperonage == "" ? "0" : that.tumbleInfo.chaperonage
        );

      this.tumbleInfo.total = total + "";
    }, 10);
  }

  getAssResult(total) {
    if (total != "") {
      let grade = parseInt(total);
      if (grade >= 23 && grade <= 24) {
        return "轻度危险";
      } else if (grade >= 21 && grade <= 22) {
        return "中度危险";
      } else if (grade >= 18 && grade <= 20) {
        return "高度危险";
      } else if (grade <= 17) {
        return "极度危险";
      } else {
        return "暂无风险";
      }
    }
  }
}
