import { Utils } from "../../../common/utils/utils";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";

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

  mmseInfo = {
    recordNum: "",
    assessmentDate: "",
    anamnesis: "",
    adjuster: "",
    week: "",
    weekGrade: "",
    date: "",
    dateGrade: "",
    month: "",
    monthGrade: "",
    season: "",
    seasonGrade: "",
    year: "",
    yearGrade: "",
    province: "",
    provinceGrade: "",
    district: "",
    districtGrade: "",
    street: "",
    streetGrade: "",
    place: "",
    placeGrade: "",
    floor: "",
    floorGrade: "",
    ball: "",
    ballGrade: "",
    flag: "",
    flagGrade: "",
    tree: "",
    treeGrade: "",
    compute1: "",
    compute1Grade: "",
    compute2: "",
    compute2Grade: "",
    compute3: "",
    compute3Grade: "",
    compute4: "",
    compute4Grade: "",
    compute5: "",
    compute5Grade: "",
    rememberBall: "",
    rememberBallGrade: "",
    rememberTree: "",
    rememberTreeGrade: "",
    rememberFlag: "",
    rememberFlagGrade: "",
    watch: "",
    watchGrade: "",
    pan: "",
    panGrade: "",
    fortyFour: "",
    fortyFourGrade: "",
    paper1: "",
    paper1Grade: "",
    paper2: "",
    paper2Grade: "",
    paper3: "",
    paper3Grade: "",
    read: "",
    readGrade: "",
    write: "",
    writeGrade: "",
    structure: "",
    structureGrade: "",
    total: ""
  };

  saveInfo = {
    id: "",
    mmse: "",
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
    private route: ActivatedRoute,
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
        that.saveInfo.assDate = info.assDate;
        that.saveInfo.totalScore = info.totalScore;
        that.saveInfo.assResults = info.assResults;
        that.saveInfo.mmse = info.mmse;
        that.mmseInfo = JSON.parse(info.mmse);
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
      this.message.error("请选择需要评估的老年人!");
      return;
    }
    this.mmseInfo.assessmentDate = this.formatDate(
      this.mmseInfo.assessmentDate
    );
    this.saveInfo.mmse = JSON.stringify(this.mmseInfo);

    this.saveInfo.asser = this.mmseInfo.adjuster;
    this.saveInfo.assDate = this.mmseInfo.assessmentDate;
    this.saveInfo.totalScore = this.mmseInfo.total;
    this.saveInfo.assResults = this.getAssResult(this.mmseInfo.total);

    console.log(this.mmseInfo);
    this.saveBtnLoading = true;
    let that = this;
    if (Utils.isEmpty(that.saveInfo.id)) {
      this.user = this.localStorage.getUser();
      this.saveInfo.noteTaker = this.user.data.name;

      this.httpReq.post("mmse/save", null, this.saveInfo, data => {
        that.saveBtnLoading = false;
        if (data["status"] == 200) {
          that.message.success("保存成功！");
          that.back();
        }
      });
    } else {
      this.user = this.localStorage.getUser();
      this.saveInfo.modifier = this.user.data.name;

      this.httpReq.post("mmse/edit", null, this.saveInfo, data => {
        that.saveBtnLoading = false;
        if (data["status"] == 200) {
          that.message.success("保存成功！");
          that.back();
        }
      });
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
          that.mmseInfo.weekGrade == "" ? "0" : that.mmseInfo.weekGrade
        ) +
        parseInt(
          that.mmseInfo.dateGrade == "" ? "0" : that.mmseInfo.dateGrade
        ) +
        parseInt(
          that.mmseInfo.monthGrade == "" ? "0" : that.mmseInfo.monthGrade
        ) +
        parseInt(
          that.mmseInfo.seasonGrade == "" ? "0" : that.mmseInfo.seasonGrade
        ) +
        parseInt(
          that.mmseInfo.yearGrade == "" ? "0" : that.mmseInfo.yearGrade
        ) +
        parseInt(
          that.mmseInfo.provinceGrade == "" ? "0" : that.mmseInfo.provinceGrade
        ) +
        parseInt(
          that.mmseInfo.districtGrade == "" ? "0" : that.mmseInfo.districtGrade
        ) +
        parseInt(
          that.mmseInfo.streetGrade == "" ? "0" : that.mmseInfo.streetGrade
        ) +
        parseInt(
          that.mmseInfo.placeGrade == "" ? "0" : that.mmseInfo.placeGrade
        ) +
        parseInt(
          that.mmseInfo.floorGrade == "" ? "0" : that.mmseInfo.floorGrade
        ) +
        parseInt(
          that.mmseInfo.ballGrade == "" ? "0" : that.mmseInfo.ballGrade
        ) +
        parseInt(
          that.mmseInfo.flagGrade == "" ? "0" : that.mmseInfo.flagGrade
        ) +
        parseInt(
          that.mmseInfo.treeGrade == "" ? "0" : that.mmseInfo.treeGrade
        ) +
        parseInt(
          that.mmseInfo.compute1Grade == "" ? "0" : that.mmseInfo.compute1Grade
        ) +
        parseInt(
          that.mmseInfo.compute2Grade == "" ? "0" : that.mmseInfo.compute2Grade
        ) +
        parseInt(
          that.mmseInfo.compute3Grade == "" ? "0" : that.mmseInfo.compute3Grade
        ) +
        parseInt(
          that.mmseInfo.compute4Grade == "" ? "0" : that.mmseInfo.compute4Grade
        ) +
        parseInt(
          that.mmseInfo.compute5Grade == "" ? "0" : that.mmseInfo.compute5Grade
        ) +
        parseInt(
          that.mmseInfo.rememberBallGrade == ""
            ? "0"
            : that.mmseInfo.rememberBallGrade
        ) +
        parseInt(
          that.mmseInfo.rememberTreeGrade == ""
            ? "0"
            : that.mmseInfo.rememberTreeGrade
        ) +
        parseInt(
          that.mmseInfo.rememberFlagGrade == ""
            ? "0"
            : that.mmseInfo.rememberFlagGrade
        ) +
        parseInt(
          that.mmseInfo.watchGrade == "" ? "0" : that.mmseInfo.watchGrade
        ) +
        parseInt(that.mmseInfo.panGrade == "" ? "0" : that.mmseInfo.panGrade) +
        parseInt(
          that.mmseInfo.fortyFourGrade == ""
            ? "0"
            : that.mmseInfo.fortyFourGrade
        ) +
        parseInt(
          that.mmseInfo.paper1Grade == "" ? "0" : that.mmseInfo.paper1Grade
        ) +
        parseInt(
          that.mmseInfo.paper2Grade == "" ? "0" : that.mmseInfo.paper2Grade
        ) +
        parseInt(
          that.mmseInfo.paper3Grade == "" ? "0" : that.mmseInfo.paper3Grade
        ) +
        parseInt(
          that.mmseInfo.readGrade == "" ? "0" : that.mmseInfo.readGrade
        ) +
        parseInt(
          that.mmseInfo.writeGrade == "" ? "0" : that.mmseInfo.writeGrade
        ) +
        parseInt(
          that.mmseInfo.structureGrade == ""
            ? "0"
            : that.mmseInfo.structureGrade
        );
      that.mmseInfo.total = total + "";
    }, 10);
  }

  getAssResult(total) {
    if (total != "") {
      let grade = parseInt(total);
      if (grade >= 27) {
        return "正常";
      } else {
        return "认知功能障碍";
      }
    }
  }
}
