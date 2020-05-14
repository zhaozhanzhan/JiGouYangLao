import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { LocalStorage } from "../../../common/service/local.storage";

import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  user;

  //转归记录列表查询条件
  queryParams = {
    page: 0,
    size: 10,
    bedsore_id: ""
  };
  //table加载状态
  isTableLoading = false;
  dataArray = [];
  resultData = {
    totalElements: 0
  };

  /**
   * 转归对话框样式
   */
  turnOverStyle = {
    width: "800px",
    padding: "0 0 100px"
  };
  //是否显示转归评估对话框
  isShowTurnOverDialog = false;
  isTurnOverSaveLoading = false;
  //编辑转归评估的对话框中存储数据的对象；
  turnOverInfo = {
    asser: "",
    assDate: "",
    feel: "",
    humidity: "",
    sport: "",
    control: "",
    nutrition: "",
    friction: "",
    total: "",
    place: "",
    area: "",
    degree: "",
    explain: "",
    turnoverType: "",
    measure: {
      bedClean: "",
      paster: "",
      skinClean: "",
      medical: "",
      turnover: "",
      eat: "",
      airpillow: "",
      reliever: "",
      other: "",
      measureOther: ""
    }
  };
  //保存转归记录的对象；
  turnOverSaveInfo = {
    bedsore_id: "",
    id: "",
    noteTaker: "",
    modifier: "",
    asser: "",
    assDate: "",
    place: "",
    soretype: "",
    suggest: "",
    woundMemo: "",
    memo: "",
    bradenScore: "",
    area: "",
    bradenMemo: ""
  };
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
  bradenInfo = {
    reportDate: "",
    adjuster: "",
    diagnose: "",
    feel: "",
    humidity: "",
    sport: "",
    control: "",
    nutrition: "",
    friction: "",
    total: "",
    nerve: [
      {
        label: "脑卒中",
        value: "脑卒中"
      },
      {
        label: "脑部外伤",
        value: "脑部外伤"
      },
      {
        label: "脊髓外伤",
        value: "脊髓外伤"
      },
      {
        label: "不明原因",
        value: "不明原因"
      }
    ],
    fracture: "",
    life: "",
    heart: "",
    other: "",
    declare: "",
    type: "",
    place: "",
    area: "",
    degree: "",
    findDate: "",
    explain: "",
    measure: {
      bedClean: "",
      paster: "",
      skinClean: "",
      medical: "",
      turnover: "",
      eat: "",
      airpillow: "",
      reliever: "",
      other: "",
      measureOther: ""
    }
  };

  saveInfo = {
    id: "",
    oldman_id: "",
    noteTaker: "",
    modifier: "",
    place: "",
    reporter: "",
    reportDate: "",
    soretype: "",
    suggest: "",
    woundMemo: "",
    memo: "",
    bradenScore: "",
    area: "",
    bradenMemo: "",
    findDate: ""
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
    private localStorage: LocalStorage,
    private modalService: NzModalService
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
        that.saveInfo.noteTaker = info.noteTaker;
        that.saveInfo.place = info.place;
        that.saveInfo.reporter = info.reporter;
        that.saveInfo.reportDate = info.reportDate;
        that.saveInfo.soretype = info.soretype;
        that.saveInfo.suggest = info.suggest;
        that.saveInfo.woundMemo = info.woundMemo;
        that.saveInfo.memo = info.memo;
        that.saveInfo.bradenScore = info.bradenScore;
        that.saveInfo.area = info.area;
        that.saveInfo.bradenMemo = info.bradenMemo;
        that.bradenInfo = JSON.parse(info.braden.bradenMemo);
        that.queryParams.bedsore_id = info.id;
        that.loadingDataArray();
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
    this.bradenInfo.reportDate = this.formatDate(this.bradenInfo.reportDate);
    this.bradenInfo.findDate = this.formatDate(this.bradenInfo.findDate);
    this.saveInfo.place = this.bradenInfo.place;
    this.saveInfo.reporter = this.bradenInfo.adjuster;
    this.saveInfo.reportDate = this.bradenInfo.reportDate;
    this.saveInfo.findDate = this.bradenInfo.findDate;

    this.saveInfo.soretype = this.bradenInfo.type;
    this.saveInfo.suggest = "";
    this.saveInfo.woundMemo = this.bradenInfo.degree;
    this.saveInfo.memo = "";
    this.saveInfo.bradenScore = this.bradenInfo.total;
    this.saveInfo.area = this.bradenInfo.area;
    this.saveInfo.bradenMemo = JSON.stringify(this.bradenInfo);

    this.saveBtnLoading = true;
    let that = this;
    if (Utils.isEmpty(that.saveInfo.id)) {
      this.user = this.localStorage.getUser();
      this.saveInfo.noteTaker = this.user.data.name;
      let param = this.httpReq.post(
        "bedsore/save",
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
        "bedsore/edit",
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
        parseInt(that.bradenInfo.feel == "" ? "0" : that.bradenInfo.feel) +
        parseInt(
          that.bradenInfo.humidity == "" ? "0" : that.bradenInfo.humidity
        ) +
        parseInt(that.bradenInfo.sport == "" ? "0" : that.bradenInfo.sport) +
        parseInt(
          that.bradenInfo.control == "" ? "0" : that.bradenInfo.control
        ) +
        parseInt(
          that.bradenInfo.nutrition == "" ? "0" : that.bradenInfo.nutrition
        ) +
        parseInt(
          that.bradenInfo.friction == "" ? "0" : that.bradenInfo.friction
        );
      that.bradenInfo.total = total + "";
    }, 10);
  }

  getAssResult(total) {
    if (total != "") {
      let grade = parseInt(total);
      if (grade >= 15 && grade <= 18) {
        return "轻度危险";
      } else if (grade >= 13 && grade <= 14) {
        return "中度危险";
      } else if (grade >= 10 && grade <= 12) {
        return "高度危险";
      } else if (grade <= 9) {
        return "极度危险";
      } else {
        return "暂无潜在危险";
      }
    }
  }

  /**
   * 添加转归按钮点击
   */
  addTurnOver(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowTurnOverDialog = true;
    this.turnOverInfo.place = this.bradenInfo.place;
    this.turnOverInfo.area = this.bradenInfo.area;
    this.turnOverInfo.degree = this.bradenInfo.degree;
  }

  /**
   * 编辑转归按钮点击
   */
  modifyTurnOver(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.isShowTurnOverDialog = true;
    this.turnOverSaveInfo = data;
    this.turnOverInfo = JSON.parse(data.braden.bradenMemo);
  }
  /**
   * 转归对话框中braden评分
   */
  turnOverGradeChange() {
    let that = this;
    setTimeout(() => {
      let total =
        parseInt(that.turnOverInfo.feel == "" ? "0" : that.turnOverInfo.feel) +
        parseInt(
          that.turnOverInfo.humidity == "" ? "0" : that.turnOverInfo.humidity
        ) +
        parseInt(
          that.turnOverInfo.sport == "" ? "0" : that.turnOverInfo.sport
        ) +
        parseInt(
          that.turnOverInfo.control == "" ? "0" : that.turnOverInfo.control
        ) +
        parseInt(
          that.turnOverInfo.nutrition == "" ? "0" : that.turnOverInfo.nutrition
        ) +
        parseInt(
          that.turnOverInfo.friction == "" ? "0" : that.turnOverInfo.friction
        );
      that.turnOverInfo.total = total + "";
    }, 10);
  }
  /**
   * 关闭转归对话框
   */
  cancelTurnOverDialog() {
    this.isShowTurnOverDialog = false;
  }

  /**
   * 保存转归记录按钮点击
   */
  onSaveTurnOver() {
    if (Utils.isEmpty(this.saveInfo.id)) {
      this.message.error("数据错误！");
      return;
    }

    this.turnOverSaveInfo.bedsore_id = this.saveInfo.id;
    this.turnOverSaveInfo.asser = this.turnOverInfo.asser;
    this.turnOverSaveInfo.assDate = this.formatDate(this.turnOverInfo.assDate);
    this.turnOverSaveInfo.place = this.turnOverInfo.place;
    this.turnOverSaveInfo.soretype = this.turnOverInfo.turnoverType;
    this.turnOverSaveInfo.suggest = "";
    this.turnOverSaveInfo.woundMemo = this.turnOverInfo.degree;
    this.turnOverSaveInfo.memo = "";
    this.turnOverSaveInfo.bradenScore = this.turnOverInfo.total;
    this.turnOverSaveInfo.area = this.turnOverInfo.area;
    this.turnOverSaveInfo.bradenMemo = JSON.stringify(this.turnOverInfo);

    this.isTurnOverSaveLoading = true;
    let that = this;
    if (Utils.isEmpty(that.turnOverSaveInfo.id)) {
      this.user = this.localStorage.getUser();
      this.turnOverSaveInfo.noteTaker = this.user.data.name;
      let param = this.httpReq.post(
        "bedsoreMemo/save",
        null,
        this.turnOverSaveInfo,
        data => {
          that.isTurnOverSaveLoading = false;
          if (data["status"] == 200) {
            that.message.success("保存成功！");
            that.isShowTurnOverDialog = false;
            that.loadingDataArray(true);
          }
        }
      );
    } else {
      this.user = this.localStorage.getUser();
      this.turnOverSaveInfo.modifier = this.user.data.name;
      let param = this.httpReq.post(
        "bedsoreMemo/edit",
        null,
        this.turnOverSaveInfo,
        data => {
          that.isTurnOverSaveLoading = false;
          if (data["status"] == 200) {
            that.message.success("保存成功！");
            that.isShowTurnOverDialog = false;
            that.loadingDataArray(true);
          }
        }
      );
    }
  }

  loadingDataArray(reset: boolean = false) {
    const that = this;

    if (reset) {
      this.queryParams.page = 0;
    } else {
      //接口page从0下标位开始
      this.queryParams.page = this.queryParams.page - 1;
      if (this.queryParams.page < 0) {
        this.queryParams.page = 0;
      }
    }

    that.isTableLoading = true;
    let param = this.httpReq.post(
      "bedsoreMemo/list",
      null,
      this.queryParams,
      data => {
        this.queryParams.page++;
        sessionStorage.setItem(
          this.router.url,
          JSON.stringify(this.queryParams)
        );

        that.isTableLoading = false;
        if (data["status"] == 200) {
          this.dataArray = data["data"]["content"]; // 数据列表
          this.resultData.totalElements = data["data"]["totalElements"]; // 总条数
        }
      }
    );
  }

  /**
   * 删除转归记录
   */
  delTurnOver(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (e) {
      e.preventDefault();
    }
    let that = this;
    this.modalService.confirm({
      nzTitle: "确定需要删除当前转归记录吗?",
      nzContent:
        '<b style="color: red;">转归记录删除后无法恢复，请谨慎操作！</b>',
      nzOkText: "确认删除",
      nzOkType: "danger",
      nzOnOk: () => {
        let param = {
          id: data.id
        };
        that.isTableLoading = true;
        that.httpReq.post("bedsoreMemo/del", null, param, data => {
          that.isTableLoading = false;
          if (data["status"] == 200) {
            that.loadingDataArray();
          }
        });
      },
      nzCancelText: "再想想",
      nzOnCancel: () => {}
    });
  }
}
