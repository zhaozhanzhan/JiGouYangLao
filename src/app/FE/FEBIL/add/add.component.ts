import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { ENgxPrintComponent } from "e-ngx-print";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
  queryParams = {
    oldManId: "", //"老人ID",
    itemCode: "", //"项目编号",
    itemName: "", //"项目名字",
    bedNo: "", //"床位号",
    btime: "", //"开始时间",
    etime: "", //"结束时间",
    expCategoryName: "", //"类别名字",
    chargeMode: "", //"收费方式",
    feeMode: "", //"计费方式",
    settlementStatus: "" //"结算状态"}
  };
  // 老人的基本信息
  oldManObjInfo = {
    name: "", //"老人姓名",
    sex: "", //"性别",
    age: "", //"年龄",
    cardno: "", //"身份证",
    roomName: "", //"房间号",
    inDate: "", //"入院日期",
    days: "" //"住院天数",
  };
  //table加载状态
  isTableLoading = false; //表格加载状态
  dataArray = []; //数据
  resultData = {
    //条数
    totalElements: 0
  };
  date;
  accountList = [];

  // 保存时参数
  saveObj = {
    oldManId: "", //"老人ID",
    chargeMode: "", //"收费方式",
    feeMode: "", //"计费方式",
    remark: "", //"备注",
    consumptionTime: "", //"消费时间",
    expItemId: "", //"消费项目id",
    expCategoryId: "", //"消费类别id",
    costMoney: 0, //"消费金钱",
    costQuantity: 1, //"消费数量",
    consumerRegistrationId: "", //扣款账目
    unitPrice: 0, //"单价"
    specs: "", //"规格"
    couponD: "", //"抵扣券ID",
    couponB: "", //"补价券id"}
    deductibleAmount: 0, //抵扣金额
    supplementAmount: 0, //补价金额
    deductionType: "", //抵扣类型
    supplementType: "" //补价类型
  };
  disabled = false;
  rebateList = []; //抵扣劵
  couponsList = []; //补加劵
  id;
  settlementStatus;
  allInfoIsVisible = false; //查看详情时显示弹出框
  public isPrintNow: boolean = false; // 是否正在打印
  // public printCSS: Array<string> = [
  //   "assets/css/common.css",
  //   "assets/css/ng-zorro-antd.min.css"
  // ]; // 打印内容css文件路径
  public printStyle: string = `
  .left{
    width:100px;
    float:left
  }

  .w2{
    width:500x;
    float:left
  }
  `;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件
  constructor(
    private jsUtil: JsUtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.queryParams = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.queryParams.btime) &&
        !Utils.isEmpty(this.queryParams.etime)
      ) {
        this.date.push(new Date(this.queryParams.btime));
        this.date.push(new Date(this.queryParams.etime));
      }
    }
    const dataId = this.route.snapshot.paramMap.get("id");
    //  获得老人的缴存信息
    this.getRegistration(dataId);
    this.queryParams.oldManId = dataId;
    this.loadingDataArray();
<<<<<<< HEAD

    const myDate = new Date();
    const date = myDate.toLocaleDateString() + "";
    const dateStr = date.split("/").join("-") + " 00:00:00";
    console.log(dateStr);
    // this.date.push(new Date(dateStr));
    // this.date.push(new Date(dateStr));
=======
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
  }
  //  获得老人的缴存信息
  getRegistration(id) {
    this.httpReq.post("consumerRegistration/get", null, { id: id }, data => {
      if (data["code"] == 0) {
        const result = data["data"];
        this.oldManObjInfo = result;
        this.accountList = result["ConsumerRegistration"];
      }
    });
  }
  loadingDataArray(reset: boolean = false) {
    const that = this;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.queryParams));
    that.isTableLoading = true;
    this.httpReq.post(
      "consumption/consumptionList",
      null,
      this.queryParams,
      data => {
        that.isTableLoading = false;
        if (data["status"] == 200) {
          this.dataArray = data["data"]["consumptionList"]; // 数据列表
        }
      }
    );
  }

  //跳转查看页面
  showInfo(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.allInfoIsVisible = true;
    this.httpReq.post(
<<<<<<< HEAD
      "consumption/consumptionDetails",
=======
      "consumption/consumptionRecordDetails",
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
      null,
      { id: id },
      data => {
        if (data["code"] == 0) {
          const result = data["data"];
<<<<<<< HEAD
          this.accountList = result.consumerRegistration;
          this.saveObj.expCategoryId =
            result.consumption.expItem.expCategoryInfo.name;
          this.saveObj.expItemId = result.consumption.expItem.itemName;
          this.saveObj.consumptionTime = result.consumption.consumptionTime;
          if (result.consumption.chargeMode == "1") {
            this.saveObj.chargeMode = "现结";
          } else if (result.consumption.chargeMode == "2") {
=======
          this.saveObj.expCategoryId =
            result.consumptionRecords.expItem.expCategoryInfo.name;
          this.saveObj.expItemId = result.consumptionRecords.expItem.itemName;
          this.saveObj.consumptionTime =
            result.consumptionRecords.consumptionTime;
          if (result.consumptionRecords.chargeMode == "1") {
            this.saveObj.chargeMode = "现结";
          } else if (result.consumptionRecords.chargeMode == "2") {
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
            this.saveObj.chargeMode = "代扣";
          } else {
            this.saveObj.chargeMode = "";
          }
          this.saveObj.consumerRegistrationId =
<<<<<<< HEAD
            result.consumption.expItem.depositAccountsInfo.accountsName;
          this.saveObj.feeMode = result.consumption.feeMode;
          this.saveObj.costQuantity = result.consumption.costQuantity;
          this.saveObj.unitPrice = result.consumption.expItem.unitPrice;
          this.saveObj.specs = result.consumption.expItem.specs;
          this.saveObj.couponD = result.couponD;
          this.saveObj.couponB = result.couponB;
          this.saveObj.costMoney = result.consumption.costMoney;
          this.saveObj.remark = result.consumption.remark;
          this.settlementStatus = result.consumption.settlementStatus;
=======
            result.consumptionRecords.expItem.depositAccountsInfo.accountsName;
          this.saveObj.feeMode = result.consumptionRecords.feeMode;
          this.saveObj.costQuantity = result.consumptionRecords.costQuantity;
          this.saveObj.unitPrice = result.consumptionRecords.expItem.unitPrice;
          this.saveObj.specs = result.consumptionRecords.expItem.specs;
          this.saveObj.couponD = result.couponD;
          this.saveObj.couponB = result.couponB;
          this.saveObj.costMoney = result.consumptionRecords.costMoney;
          // this.saveObj.remark = result.consumptionRecords.remark;
          this.settlementStatus = result.consumptionRecords.settlementStatus;
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
          this.disabled = true;
        }
      }
    );
  }

  /**
   * 日期插件时间发生变化的回调
   * @param dateArr
   */
  public selDate(dateArr: Array<Date>) {
    if (dateArr[0]) {
      this.queryParams.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.queryParams.btime = "";
    }
    if (dateArr[1]) {
      this.queryParams.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.queryParams.etime = "";
    }
  }

  // 返回
  back(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    history.back();
  }
  isShow = false;
  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof MedicalRecordComponent
   */
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.isPrintNow = true; // 正在打印
    this.isShow = true;
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isPrintNow = false;
    this.isShow = false;
  }
}
