import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { Utils } from "../../../common/utils/utils";
import { Local } from "../../../common/service/Storage";
@Component({
  selector: "",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  //控制编辑对话框显示；
  isShowEditDialog = false;
  //编辑对话框中保存按钮的loading状态；
  isEditBtnLoading = false;
  Details = "";
  //添加灭火器对象
  editParams = {
    id: "",
    noteTaker: "",
    productionDate: "",
    fireType: "",
    expiry: 6,
    dosageType: "",
    dosageTypeOther: "",
    moveType: ""
  };
  isCheckDetails = false; //是否显示查看报废原因
  //添加对话框不允许选择今天以后的出厂日期
  today = new Date();
  disabledDate = (current: Date): boolean => {
    return this.dateDiff(current, this.today) > 0;
  };
  //消防区域列表
  ffdArea = [];
  isLoadinngArea = false;
  //消防巡查点列表；
  ffdAreaPoint = [];
  isLoadingPoint = false;
  //控制绑定对话框显示
  isShowLinkDialog = false;
  isLinkBtnLoading = false;
  linkParams = {
    ids: "",
    modifier: "",
    ffdId: "",
    ffdAreaId: "",
    ffdAreaPage: 0,
    ffdAreaTotalPages: 1,
    ffdPointPage: 0,
    ffdPointTotalPages: 1
  };

  //控制解绑对话框显示
  isShowUnlinkDialog = false;
  isUnlinkBtnLoading = false;
  unlinkParams = { ids: "", modifier: "" };

  //控制删除对话框显示
  isShowDelDialog = false;
  isDelBtnLoading = false;
  delParams = { ids: "", modifier: "" };

  //控制报废对话框显示
  isShowScrapDialog = false;
  //控制报废对话框中报废按钮的loading状态；
  isScrapBtnLoading = false;

  scrapParams = { ids: "", modifier: "", reason: "" };
  //批量勾选的状态
  allChecked = false;
  indeterminate = false;

  //控制添加对话框显示；
  isShowAddDialog = false;
  //添加对话框中保存按钮的loading状态；
  isSaveBtnLoading = false;

  //灭火器剂型
  dosageType = ["干粉", "水基", "清洁气体", "二氧化碳", "其他"];
  //灭火器移动方式
  moveType = ["手提式", "推车式"];

  //添加灭火器对象
  saveParams = {
    id: "",
    fireType: "",
    dosageType: "",
    moveType: "",
    fireExtinguisherNum: 1,
    productionDate: "",
    expiry: 1,
    noteTaker: "",
    dosageTypeOther: ""
  };

  appayType = "全部";
  date = "";

  queryParams = {
    page: 0,
    size: 10,
    isScrap: "",
    isLinked: "",
    ffdId: "",
    btime: "",
    etime: "",
    choosedDateRange: [],
    ffdAreaId: "",
    ffdAreaPage: 0,
    ffdAreaTotalPages: 1,
    ffdPointPage: 0,
    ffdPointTotalPages: 1
  };

  //table加载状态
  isTableLoading = false;
  resultData = {
    totalElements: 0
  };
  arrayData = [];
  //  计算定义灭火器的失效时间和状态
  ExtinguisherDetails = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.loadingDataArray(true);
    this.queryLoadAreaMore(true);
  }

  turnToEdit(inApply) {
    this.router.navigate(["info", JSON.stringify(inApply)], {
      relativeTo: this.route
    });
  }
  // 提示信息
  createMessage(type: string, mess: string): void {
    this.message.create(type, `${mess}`);
  }

  /**
   * 列表查询条件加载更多的消防区域
   */
  queryLoadAreaMore(isReset: Boolean = false) {
    if (isReset) {
      this.queryParams.ffdAreaPage = 0;
      this.ffdArea = [];
    } else {
      if (
        this.queryParams.ffdAreaPage + 1 <
        this.queryParams.ffdAreaTotalPages
      ) {
        this.queryParams.ffdAreaPage = this.queryParams.ffdAreaPage + 1;
      } else {
        return;
      }
    }

    let that = this;
    this.isLoadinngArea = true;
    let param = { page: this.queryParams.ffdAreaPage, size: 10 };
    this.httpReq.post("ffdArea/listAll", null, param, data => {
      this.isLoadinngArea = false;
      if (data["code"] == 0) {
        data["data"] = JSON.parse(data["data"]);
        that.ffdArea = [...that.ffdArea, ...data["data"]["value"]];
        that.queryParams.ffdAreaPage = this.queryParams.ffdAreaPage + 1;
        that.queryParams.ffdAreaTotalPages = data["data"]["totalPages"];

        if (!Utils.isEmpty(that.queryParams.ffdId)) {
          that.queryLoadPointMore(true);
        }
      }
    });
  }

  /**
   * 列表查询条件加载更多的消防点
   */
  queryLoadPointMore(isReset: Boolean = false) {
    if (Utils.isEmpty(this.queryParams.ffdAreaId)) {
      return;
    }
    this.queryParams.ffdId = "";
    if (isReset) {
      this.ffdAreaPoint = [];
      this.queryParams.ffdPointPage = 0;
    } else {
      if (
        this.queryParams.ffdPointPage + 1 <
        this.queryParams.ffdPointTotalPages
      ) {
        this.queryParams.ffdPointPage = this.queryParams.ffdPointPage + 1;
      } else {
        return;
      }
    }

    let that = this;
    this.isLoadingPoint = true;
    let param = {
      ffdArea_id: this.queryParams.ffdAreaId,
      page: this.queryParams.ffdPointPage,
      size: 10
    };
    this.httpReq.post("fireFightingDevice/list", null, param, data => {
      this.isLoadingPoint = false;
      if (data["code"] == 0) {
        that.ffdAreaPoint = [...that.ffdAreaPoint, ...data["data"]["content"]];
        that.queryParams.ffdPointPage = this.queryParams.ffdPointPage + 1;
        that.queryParams.ffdPointTotalPages = data["data"]["totalPages"];
      }
    });
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
      "fireExtinguisher/FEListCondition",
      null,
      this.queryParams,
      data => {
        this.queryParams.page++;
        sessionStorage.setItem(
          this.router.url,
          JSON.stringify(this.queryParams)
        );
        that.isTableLoading = false;
        if (data["code"] == 0) {
          data["data"] = JSON.parse(data["data"]);
          that.arrayData = [];
          let tempArray = data["data"]["value"]; // 数据列表
          that.resultData.totalElements = data["data"]["totalElements"]; // 总条数

          tempArray.forEach(element => {
            let extinguisher = {
              createDate: element.createDate,
              expiry: element.expiry,
              fireType: element.fireType,
              id: element.id,
              isLinked: element.isLinked,
              isScrap: element.isScrap,
              productionDate: element.productionDate,
              updateDate: element.updateDate,
              state: "",
              checked: false,
              disabled: false,
              expiryDate: ""
            };
            extinguisher = element;

            //计算失效日期；失效日期需要-1天，如2018年12月05日-----2019年12月04日
            let expiryYear = that.dateAdd(
              "y",
              Number.parseInt(element.expiry),
              new Date(element.productionDate)
            );
            let expiryDate = that.dateAdd("d", -1, expiryYear);
            extinguisher.expiryDate = expiryDate;
            //计算距离失效日期还有多少天
            let diffDays = that.dateDiff(expiryDate, new Date());

            //若已销毁，直接显示销毁状态
            if (extinguisher.isScrap == "1") {
              extinguisher.state = "已报废";
            } else {
              //根据失效日期判断显示状态
              if (diffDays < 0) {
                extinguisher.state = "失效";
              } else if (diffDays > 0 && diffDays < 180) {
                extinguisher.state = "临期";
              } else {
                extinguisher.state = "有效";
              }
            }
            that.arrayData.push(extinguisher);
          });
        } else {
          this.createMessage("error", data["message"]);
        }
      }
    );
  }

  /*
   *   功能:日期添加功能.
   *   参数:interval,字符串表达式，表示要添加的时间间隔.
   *   参数:number,数值表达式，表示要添加的时间间隔的个数.
   *   参数:date,时间对象.
   *   返回:新的时间对象.
   *   var now = new Date();
   *   var newDate = DateAdd( "d", 5, now);
   *---------------   DateAdd(interval,number,date)   -----------------
   */
  dateAdd(interval, number, date) {
    switch (interval) {
      case "y": {
        date.setFullYear(date.getFullYear() + number);
        return date;
      }
      case "q": {
        date.setMonth(date.getMonth() + number * 3);
        return date;
      }
      case "m": {
        date.setMonth(date.getMonth() + number);
        return date;
      }
      case "w": {
        date.setDate(date.getDate() + number * 7);
        return date;
      }
      case "d": {
        date.setDate(date.getDate() + number);
        return date;
      }
      case "h": {
        date.setHours(date.getHours() + number);
        return date;
      }
      case "m": {
        date.setMinutes(date.getMinutes() + number);
        return date;
      }
      case "s": {
        date.setSeconds(date.getSeconds() + number);
        return date;
      }
      default: {
        date.setDate(date.getDate() + number);
        return date;
      }
    }
  }
  //  获得当日日期
  formatDate(date: Date) {
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    let monthStr = "";
    let dayStr = "";
    if (month >= 1 && month <= 9) {
      monthStr = "0" + month;
    } else {
      monthStr = month + "";
    }
    if (day >= 0 && day <= 9) {
      dayStr = "0" + day;
    } else {
      dayStr = day + "";
    }
    return year + seperator1 + monthStr + seperator1 + dayStr;
  }

  /**
   * 计算两个日期的相差天数
   */
  dateDiff(d1, d2) {
    var day = 24 * 60 * 60 * 1000;
    try {
      var checkTime = d1.getTime();
      var checkTime2 = d2.getTime();
      var cha = (checkTime - checkTime2) / day;
      return cha;
    } catch (e) {
      return false;
    }
  }

  /**
   * 显示添加灭火器对话框；
   */
  showAddDialog() {
    this.saveParams = {
      id: "",
      fireType: "",
      dosageType: "",
      moveType: "",
      fireExtinguisherNum: 1,
      productionDate: "",
      expiry: 1,
      noteTaker: "",
      dosageTypeOther: ""
    };
    this.isShowAddDialog = true;
  }
  /**
   * 选择灭火器类型切换监听
   */
  choosedDosageType() {
    switch (this.saveParams.dosageType) {
      case "干粉":
        this.saveParams.expiry = 10;
        break;
      case "水基":
        this.saveParams.expiry = 6;

        break;
      case "清洁气体":
        this.saveParams.expiry = 10;

        break;
      case "二氧化碳":
        this.saveParams.expiry = 12;

        break;
      default:
        this.saveParams.expiry = 6;
    }
  }

  /**
   * 保存灭火器
   */
  saveFireExtinguisher() {
    if (
      !Utils.isNumber(this.saveParams.fireExtinguisherNum) ||
      this.saveParams.fireExtinguisherNum <= 0
    ) {
      this.message.error("请输入灭火器数量！");
      return;
    }
    if (Utils.isEmpty(this.saveParams.dosageType)) {
      this.message.error("请选择灭火器种类！");
      return;
    }

    if (this.saveParams.dosageType == "其他") {
      if (Utils.isEmpty(this.saveParams.dosageTypeOther)) {
        this.message.error("请输入其他种类的灭火器！");
        return;
      }
    }

    if (Utils.isEmpty(this.saveParams.moveType)) {
      this.message.error("请选择灭火器移动方式！");
      return;
    }

    //灭火器种类和移动方式合并为一个字段提交
    if (this.saveParams.dosageType == "其他") {
      this.saveParams.fireType =
        this.saveParams.dosageTypeOther + this.saveParams.moveType;
    } else {
      this.saveParams.fireType =
        this.saveParams.dosageType + this.saveParams.moveType;
    }

    if (Utils.isEmpty(this.saveParams.productionDate)) {
      this.message.error("请选择灭火器出厂日期！");
      return;
    }

    if (
      !Utils.isNumber(this.saveParams.expiry) ||
      this.saveParams.expiry <= 0
    ) {
      this.message.error("请输入灭火器报废期限！");
      return;
    }

    this.saveParams.noteTaker = Local.getObj("UserInfo").name;

    let that = this;
    this.isSaveBtnLoading = true;

    this.httpReq.post(
      "fireExtinguisher/saveFE",
      null,
      this.saveParams,
      data => {
        this.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("灭火器添加成功！");
          that.isShowAddDialog = false;
          that.loadingDataArray(true);
        }
      }
    );
  }

  refreshStatus(): void {
    const allChecked = this.arrayData
      .filter(value => !value.disabled)
      .every(value => value.checked === true);
    const allUnChecked = this.arrayData
      .filter(value => !value.disabled)
      .every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.arrayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  /**
   * 批量报废处理对话框显示
   */
  scrap() {
    const allUnChecked = this.arrayData
      .filter(value => !value.disabled)
      .every(value => !value.checked);
    if (allUnChecked) {
      this.message.error("未勾选灭火器！");
      return;
    }

    this.scrapParams = { ids: "", modifier: "", reason: "" };
    this.isShowScrapDialog = true;
  }

  /**
   * 提交批量报废处理
   */
  scrapFireExtinguisher() {
    if (Utils.isEmpty(this.scrapParams.reason)) {
      this.message.error("请填写报废原因！");
      return;
    }

    if (this.scrapParams.reason.length > 50) {
      this.message.error("报废原因过长，请控制在五十字以内！");
      return;
    }

    this.scrapParams.modifier = sessionStorage.getItem("personName");

    let selected = [];
    this.arrayData.forEach(data => {
      if (data.checked) {
        selected.push(data.id);
      }
    });
    this.scrapParams.ids = selected.toString();
    let that = this;
    this.isScrapBtnLoading = true;
    this.httpReq.post(
      "fireExtinguisher/doScrap",
      null,
      this.scrapParams,
      data => {
        this.isScrapBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("灭火器报废成功！");
          that.isShowScrapDialog = false;
          that.loadingDataArray(true);
        }
      }
    );
  }

  // 查看灭火器报废原因
  chackDiscardReasonDetails(info) {
    this.isCheckDetails = true;
    this.Details = info.scrapReason;
  }

  //显示删除灭火器前提示对话框
  del() {
    const allUnChecked = this.arrayData
      .filter(value => !value.disabled)
      .every(value => !value.checked);
    if (allUnChecked) {
      this.message.error("未勾选灭火器！");
      return;
    }

    this.delParams = { ids: "", modifier: "" };
    this.isShowDelDialog = true;
  }

  delFireExtinguisher() {
    this.delParams.modifier = sessionStorage.getItem("personName");
    let selected = [];
    this.arrayData.forEach(data => {
      if (data.checked) {
        selected.push(data.id);
      }
    });
    this.delParams.ids = selected.toString();

    let that = this;
    this.isDelBtnLoading = true;
    this.httpReq.post("fireExtinguisher/delFE", null, this.delParams, data => {
      this.isDelBtnLoading = false;
      if (data["code"] == 0) {
        that.message.success("灭火器删除成功！");
        that.isShowDelDialog = false;
        that.loadingDataArray(true);
      }
    });
  }

  //显示解绑灭火器前提示对话框
  unlink() {
    const allUnChecked = this.arrayData
      .filter(value => !value.disabled)
      .every(value => !value.checked);
    if (allUnChecked) {
      this.message.error("未勾选灭火器！");
      return;
    }

    this.unlinkParams = { ids: "", modifier: "" };
    this.isShowUnlinkDialog = true;
  }

  unlinkFireExtinguisher() {
    this.unlinkParams.modifier = sessionStorage.getItem("personName");
    let selected = [];
    this.arrayData.forEach(data => {
      if (data.checked) {
        selected.push(data.id);
      }
    });
    this.unlinkParams.ids = selected.toString();

    let that = this;
    this.isUnlinkBtnLoading = true;
    this.httpReq.post(
      "fireExtinguisher/FEReLinked",
      null,
      this.unlinkParams,
      data => {
        this.isUnlinkBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("灭火器解绑成功！");
          that.isShowUnlinkDialog = false;
          that.loadingDataArray(true);
        }
      }
    );
  }

  //显示灭火器绑定消防巡查点前提示对话框
  link() {
    const allUnChecked = this.arrayData
      .filter(value => !value.disabled)
      .every(value => !value.checked);
    if (allUnChecked) {
      this.message.error("未勾选灭火器！");
      return;
    }

    this.linkParams = {
      ids: "",
      modifier: "",
      ffdId: "",
      ffdAreaId: "",
      ffdAreaPage: 0,
      ffdAreaTotalPages: 1,
      ffdPointPage: 0,
      ffdPointTotalPages: 1
    };
    this.isShowLinkDialog = true;
    this.ffdArea = [];
    this.ffdAreaPoint = [];
    this.loadAreaMore(true);
  }

  linkFireExtinguisher() {
    this.linkParams.modifier = sessionStorage.getItem("personName");
    let selected = [];
    this.arrayData.forEach(data => {
      if (data.checked) {
        selected.push(data.id);
      }
    });
    this.linkParams.ids = selected.toString();

    let that = this;
    this.isLinkBtnLoading = true;
    this.httpReq.post(
      "fireExtinguisher/FELinked",
      null,
      this.linkParams,
      data => {
        this.isLinkBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("灭火器绑定成功！");
          that.isShowLinkDialog = false;
          that.loadingDataArray(true);
        }
      }
    );
  }

  /**
   * 加载更多的消防区域
   */
  loadAreaMore(isReset: Boolean = false) {
    if (isReset) {
      this.linkParams.ffdAreaPage = 0;
      this.ffdArea = [];
    } else {
      if (this.linkParams.ffdAreaPage + 1 < this.linkParams.ffdAreaTotalPages) {
        this.linkParams.ffdAreaPage = this.linkParams.ffdAreaPage + 1;
      } else {
        return;
      }
    }

    let that = this;
    this.isLoadinngArea = true;
    let param = {
      page: this.linkParams.ffdAreaPage,
      size: 10
    };
    this.httpReq.post("ffdArea/listAll", null, param, data => {
      this.isLoadinngArea = false;
      if (data["code"] == 0) {
        data["data"] = JSON.parse(data["data"]);
        that.ffdArea = [...that.ffdArea, ...data["data"]["value"]];
        that.linkParams.ffdAreaPage = this.linkParams.ffdAreaPage + 1;
        that.linkParams.ffdAreaTotalPages = data["data"]["totalPages"];
      }
    });
  }

  /**
   * 加载更多的消防点
   */
  loadPointMore(isReset: Boolean = false) {
    if (Utils.isEmpty(this.linkParams.ffdAreaId)) {
      this.message.error("请先选择消防区域！");
      return;
    }
    if (isReset) {
      this.linkParams.ffdPointPage = 0;
      this.ffdAreaPoint = [];
    } else {
      if (
        this.linkParams.ffdPointPage + 1 <
        this.linkParams.ffdPointTotalPages
      ) {
        this.linkParams.ffdPointPage = this.linkParams.ffdPointPage + 1;
      } else {
        return;
      }
    }

    let that = this;
    this.isLoadingPoint = true;
    let param = {
      ffdArea_id: this.linkParams.ffdAreaId,
      page: this.linkParams.ffdPointPage,
      size: 10
    };
    this.httpReq.post("fireFightingDevice/list", null, param, data => {
      this.isLoadingPoint = false;
      if (data["code"] == 0) {
        that.ffdAreaPoint = [...that.ffdAreaPoint, ...data["data"]["content"]];
        that.linkParams.ffdPointPage = this.linkParams.ffdPointPage + 1;
        that.linkParams.ffdPointTotalPages = data["data"]["totalPages"];
      }
    });
  }

  /**
   * 显示编辑灭火器对话框；
   */
  showEditDialog(data) {
    console.log("tag", data);
    let temp = {
      id: data.id,
      noteTaker: "",
      productionDate: data.productionDate,
      fireType: data.fireType,
      expiry: data.expiry,
      dosageType: "",
      dosageTypeOther: "",
      moveType: ""
    };

    this.moveType.forEach(element => {
      let type = temp.fireType;
      if (type.indexOf(element) != -1) {
        type = type.replace(element, "");
        temp.moveType = element; //拆分出移动方式

        if (this.dosageType.toString().indexOf(type) == -1) {
          temp.dosageTypeOther = type;
          temp.dosageType = "其他";
        } else {
          temp.dosageType = type; //拆分出种类
        }
      }
    });

    this.editParams = temp;
    console.log("tag", this.editParams);
    this.isShowEditDialog = true;
  }

  /**
   * 编辑灭火器
   */
  updateFireExtinguisher() {
    if (Utils.isEmpty(this.editParams.dosageType)) {
      this.message.error("请选择灭火器种类！");
      return;
    }

    if (this.editParams.dosageType == "其他") {
      if (Utils.isEmpty(this.editParams.dosageTypeOther)) {
        this.message.error("请输入其他种类的灭火器！");
        return;
      }
    }

    if (Utils.isEmpty(this.editParams.moveType)) {
      this.message.error("请选择灭火器移动方式！");
      return;
    }

    //灭火器种类和移动方式合并为一个字段提交
    if (this.editParams.dosageType == "其他") {
      this.editParams.fireType =
        this.editParams.dosageTypeOther + this.editParams.moveType;
    } else {
      this.editParams.fireType =
        this.editParams.dosageType + this.editParams.moveType;
    }

    if (Utils.isEmpty(this.editParams.productionDate)) {
      this.message.error("请选择灭火器出厂日期！");
      return;
    }
    //强制时间转换为字符串，由于angular的日期格式自动转换给http的时候由于使用的时区不同，导致存在误差；
    let tempDate = new Date(this.editParams.productionDate);
    this.editParams.productionDate = this.formatDate(tempDate);
    if (
      !Utils.isNumber(this.editParams.expiry) ||
      this.editParams.expiry <= 0
    ) {
      this.message.error("请输入灭火器报废期限！");
      return;
    }

    this.editParams.noteTaker = Local.getObj("UserInfo").name;

    let that = this;
    this.isSaveBtnLoading = true;

    this.httpReq.post(
      "fireExtinguisher/updateFE",
      null,
      this.editParams,
      data => {
        this.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("灭火器编辑成功！");
          that.isShowEditDialog = false;
          that.loadingDataArray(true);
        }
      }
    );
  }

  /**
   * 查询条件选择日期范围变更
   * @param dateArr
   */
  onChooseQueryDateChange(dateArr: Array<Date>) {
    if (dateArr[0]) {
      this.queryParams.btime = this.dateFormmat(dateArr[0], "yyyy-MM-dd");
    } else {
      this.queryParams.btime = "";
    }
    if (dateArr[1]) {
      this.queryParams.etime = this.dateFormmat(dateArr[1], "yyyy-MM-dd");
    } else {
      this.queryParams.etime = "";
    }
  }

  dateFormmat(date: Date, fmt: string) {
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }; //月份 //日 //小时 //分 //秒 //季度 //毫秒
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  }

  reset() {
    this.queryParams = {
      page: 0,
      size: 10,
      isScrap: "",
      isLinked: "",
      ffdId: "",
      btime: "",
      etime: "",
      choosedDateRange: [],
      ffdAreaId: "",
      ffdAreaPage: 0,
      ffdAreaTotalPages: 1,
      ffdPointPage: 0,
      ffdPointTotalPages: 1
    };
    this.loadingDataArray(true);
  }
}
