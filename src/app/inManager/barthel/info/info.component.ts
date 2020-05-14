import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { LocalStorage } from "../../../common/service/local.storage";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
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

  barthelInfo = {
    assessmentDate: "",
    adjuster: "",
    diagnose: "",
    shit: "",
    pee: "",
    beautify: "",
    potty: "",
    eat: "",
    move: "",
    action: "",
    dress: "",
    floor: "",
    wash: "",
    total: ""
  };

  saveInfo = {
    id: "",
    pasteur: "",
    oldman_id: "",
    noteTaker: "",
    modifier: "",
    asser: "",
    assDate: "",
    totalScore: "",
    assResults: ""
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStroage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    let that = this;
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
        that.saveInfo.assResults = info.assResults;
        that.saveInfo.pasteur = info.pasteur;
        that.barthelInfo = JSON.parse(info.pasteur);
      }
    });
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
      this.message.error("请选择需要评估的长者!");
      return;
    }
    this.barthelInfo.assessmentDate = this.formatDate(
      this.barthelInfo.assessmentDate
    );

    this.saveInfo.pasteur = JSON.stringify(this.barthelInfo);
    this.saveInfo.asser = this.barthelInfo.adjuster;
    this.saveInfo.assDate = this.barthelInfo.assessmentDate;
    this.saveInfo.totalScore = this.barthelInfo.total;
    this.saveInfo.assResults = this.getAssResult(this.barthelInfo.total);

    this.saveBtnLoading = true;
    let that = this;
    if (Utils.isEmpty(that.saveInfo.id)) {
      this.user = this.localStorage.getUser();
      this.saveInfo.noteTaker = this.user.data.name;
      let param = this.httpReq.post(
        "pasteur/save",
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
        "pasteur/edit",
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
        parseInt(that.barthelInfo.shit == "" ? "0" : that.barthelInfo.shit) +
        parseInt(that.barthelInfo.pee == "" ? "0" : that.barthelInfo.pee) +
        parseInt(
          that.barthelInfo.beautify == "" ? "0" : that.barthelInfo.beautify
        ) +
        parseInt(that.barthelInfo.potty == "" ? "0" : that.barthelInfo.potty) +
        parseInt(that.barthelInfo.eat == "" ? "0" : that.barthelInfo.eat) +
        parseInt(that.barthelInfo.move == "" ? "0" : that.barthelInfo.move) +
        parseInt(
          that.barthelInfo.action == "" ? "0" : that.barthelInfo.action
        ) +
        parseInt(that.barthelInfo.dress == "" ? "0" : that.barthelInfo.dress) +
        parseInt(that.barthelInfo.floor == "" ? "0" : that.barthelInfo.floor) +
        parseInt(that.barthelInfo.wash == "" ? "0" : that.barthelInfo.wash);
      this.barthelInfo.total = total + "";
    }, 10);
  }

  getAssResult(total) {
    if (total != "") {
      let grade = parseInt(total);
      if (grade >= 0 && grade <= 20) {
        return "极严重功能障碍";
      } else if (grade >= 25 && grade <= 45) {
        return "严重功能障碍";
      } else if (grade >= 50 && grade <= 70) {
        return "中度功能缺陷";
      } else if (grade >= 75 && grade <= 95) {
        return "轻度功能缺陷";
      } else if (grade == 100) {
        return "ADL自理";
      }
    }
  }
}
