/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-27 10:52:38
 * @Description:
 */
import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
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
    consumerRegistrationName: "", //扣款账目名称
    unitPrice: 0, //"单价"
    specs: "", //"规格"
    couponD: "", //"抵扣券ID",
    couponB: "", //"补价券id"}
    deductibleAmount: 0, //抵扣金额
    supplementAmount: 0, //补价金额
    deductionType: "", //抵扣类型
    supplementType: "" //补价类型
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
  // 老人列表参数
  oldManObj = {
    page: 0, //,"页数",
    size: 10, //"数量",
    name: "", //"老人姓名",
    id: "",
    cardno: "" //"老人身份证"}
  };
  totalElements = 0; //总条数
  oldManList = []; //老人列表数据
  saveLoading = false; //保存加载状态
  disabled = false; //是否可编辑
  oldManIsVisible = false; //老人列表
  isOldTableLoading = false; //老人列表加载状态
  accountList = []; //缴存账目 金额显示
  expCategoryList = []; //消费类别
  expItemList = []; //通过消费类别找消费项目
  chargeModeList = []; //收费方式
  rebateList = []; //抵扣卷
  couponsList = []; //补价劵
  sumDeduction = 0; //抵扣劵金额
  sumSupplement = 0; //补价劵金额
  allInfoIsVisible = false; //显示确认弹出框
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    const oldmanId = this.route.snapshot.paramMap.get("oldmanId");
    if (!Utils.isEmpty(oldmanId)) {
      this.getOldManList(true, oldmanId); //获得老人的列表
    } else {
      this.getOldManList(true); //获得老人的列表
    }

    this.oldManIsVisible = true; //显示老人的弹出框

    this.getExpCategory(); //获得消费类别
  }
  // 显示弹出框
  allInfo() {
    if (this.saveObj.chargeMode == "") {
      this.message.error("收费方式不能为空!!!");
      return;
    }

    if (this.saveObj.chargeMode == "2") {
      if (this.saveObj.consumerRegistrationId == "") {
        this.message.error("此老人未绑定扣款账目。");
        return;
      }
    }

    if (this.saveObj.consumptionTime == "") {
      this.message.error("消费日期不能为空!!!");
      return;
    }
    this.allInfoIsVisible = true;
  }
  // 保存
  save() {
    this.saveLoading = true;
    this.httpReq.post(
      "consumption/addConsumption",
      null,
      this.saveObj,
      data => {
        this.saveLoading = false;
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        }
      }
    );
  }

  //  获得所有的老人列表
  getOldManList(reset: boolean = false, oldmanId: string = "") {
    if (reset) {
      this.oldManObj.page = 0;
    } else {
      //接口page从0下标位开始
      this.oldManObj.page = this.oldManObj.page - 1;
      if (this.oldManObj.page < 0) {
        this.oldManObj.page = 0;
      }
    }
    if (!Utils.isEmpty(oldmanId)) {
      this.oldManObj.id = oldmanId;
    }
    this.isOldTableLoading = true;
    this.httpReq.post("consumption/listOldMan", null, this.oldManObj, data => {
      this.isOldTableLoading = false;
      if (data["code"] == 0) {
        const result = data["data"]["result"];
        this.oldManList = result;
        this.totalElements = data["data"]["totalElements"];

        if (this.oldManList.length == 1) {
          this.chooseOld(this.oldManList[0]);
        }
      }
    });
  }
  // 选择某个老人，获得基本信息
  chooseOld(data) {
    this.oldManObjInfo = data;
    this.saveObj.oldManId = data.id;
    // 获得老人的缴存信息
    this.getRegistration(data.id);
    this.getOldManVouchers(data.id);
  }
  //  获得老人的缴存信息
  getRegistration(id) {
    this.httpReq.post("consumerRegistration/get", null, { id: id }, data => {
      if (data["code"] == 0) {
        this.oldManIsVisible = false;
        this.accountList = data["data"]["ConsumerRegistration"];
      }
    });
  }
  // 获得抵扣卷和补加劵列表
  getOldManVouchers(id) {
    this.httpReq.post(
      "consumption/getOldManVouchers",
      null,
      { oldManId: id },
      data => {
        if (data["code"] == 0) {
          this.rebateList = data["data"]["rebate"];
          this.couponsList = data["data"]["supplementCoupons"];
        }
      }
    );
  }
  // 通过消费类别ID获得消费项目
  changeExpItem() {
    this.expItemList = [];
    this.saveObj.expItemId = "";
    this.saveObj.unitPrice = 0;
    this.saveObj.specs = "";
    this.saveObj.feeMode = "";
    this.saveObj.consumerRegistrationId = "";
    this.saveObj.consumerRegistrationName = "";
    this.chargeModeList = [];
    this.httpReq.post(
      "expItem/listByExpCategoryId",
      null,
      { id: this.saveObj.expCategoryId },
      data => {
        if (data["code"] == 0) {
          this.expItemList = data["data"];
        }
      }
    );
  }
  // 获得所有的消费类别
  getExpCategory() {
    this.httpReq.post("expCategory/listAll", null, null, data => {
      if (data["code"] == 0) {
        this.expCategoryList = data["data"];
      }
    });
  }
  // 消费项目  根据消费项目 得到 类型
  changeMode() {
    this.saveObj.unitPrice = 0;
    this.saveObj.specs = "";
    this.saveObj.consumerRegistrationId = "";
    this.saveObj.consumerRegistrationName = "";
    this.saveObj.feeMode = "";
    this.chargeModeList = [];
    for (let index = 0; index < this.expItemList.length; index++) {
      const e = this.expItemList[index];
      if (this.saveObj.expItemId == e.id) {
        this.saveObj.unitPrice = e.unitPrice;
        this.saveObj.specs = e.specs;
        this.saveObj.feeMode = e.feeMode;
        this.saveObj.consumerRegistrationId = e.depositAccountsInfo.id;
        this.saveObj.consumerRegistrationName =
          e.depositAccountsInfo.accountsName;
        const array = e.chargeMode.split(",");
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          const obj = {
            id: "",
            name: ""
          };

          if (element == "1") {
            obj.id = "1";
            obj.name = "现结";
          } else {
            obj.id = "2";
            obj.name = "代扣";
          }

          this.chargeModeList.push(obj);
        }
      }
    }
    if (this.chargeModeList.length == 1) {
      this.saveObj.chargeMode = this.chargeModeList[0].id;
    }

    this.getCostMoney(); //计算总价
  }
  // 获得抵扣劵金额
  changeDeductibleAmount() {
    for (let index = 0; index < this.rebateList.length; index++) {
      const e = this.rebateList[index];
      if (this.saveObj.couponD == e.id) {
        this.saveObj.deductibleAmount = e.rebate.deductibleAmount;
        this.saveObj.deductionType = e.rebate.deductionType;
      }
    }

    this.getCostMoney(); //计算总价
  }

  // 获得补加劵金额
  changeSupplementAmount() {
    for (let index = 0; index < this.couponsList.length; index++) {
      const e = this.couponsList[index];
      if (this.saveObj.couponB == e.id) {
        this.saveObj.supplementAmount = e.supplementCoupons.supplementAmount;
        this.saveObj.supplementType = e.supplementCoupons.supplementType;
      }
    }
    this.getCostMoney(); //计算总价
  }

  // 计算支付价格
  getCostMoney() {
    // 如果抵扣类型是1 金额，如果是2  百分比
    if (this.saveObj.deductionType == "1") {
      // 抵扣卷金额的时候  单价
      this.sumDeduction = this.saveObj.deductibleAmount;
    } else {
      // 抵扣卷百分比的时候  单价*(百分比/100)
      this.sumDeduction =
        (this.saveObj.deductibleAmount / 100) * this.saveObj.unitPrice;
    }
    // 如果补价类型是1 金额，如果是2  百分比
    if (this.saveObj.supplementType == "1") {
      this.sumSupplement = this.saveObj.supplementAmount;
    } else {
      // 补价卷百分比的时候  单价*(百分比/100)
      this.sumSupplement =
        (this.saveObj.supplementAmount / 100) * this.saveObj.unitPrice;
    }
    // 支付价格=单价*数量-抵扣劵价格+补价劵价格
    this.saveObj.costMoney =
      this.saveObj.unitPrice * this.saveObj.costQuantity -
      this.sumDeduction +
      this.sumSupplement;
  }

  onRangerPickerChange(e) {
    // this.saveObj.consumptionTime = this.jsUtil.dateFormat(e, "YYYY-MM-DD  00:00:00");
    this.saveObj.consumptionTime = this.jsUtil.dateFormat(
      e,
      "YYYY-MM-DD  00:00:00"
    );
    // 获得今天得日期
    const data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
<<<<<<< HEAD
    let day = data.getDate() + 1;
=======
    let day = data.getDate() - 1;
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
    let monthStr;
    let dayStr;
    if (month < 10) {
      monthStr = "0" + month;
    } else {
      monthStr = "" + month;
    }
    if (day < 10) {
      dayStr = "0" + day;
    } else {
      dayStr = "" + day;
    }
    const fullYear = year + "-" + monthStr + "-" + dayStr;
    const oDate1 = new Date(fullYear);
    const oDate2 = new Date(this.saveObj.consumptionTime);
<<<<<<< HEAD
    if (oDate1.getTime() < oDate2.getTime()) {
      this.message.error("选择的日期应该小于当前日期");
      return;
    }
  }
=======
    if (oDate1.getTime() > oDate2.getTime()) {
      this.message.error("选择的日期应该大于当前日期");
      return;
    }
  }

>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
  blur() {
    this.getCostMoney();
  }
  // 点击姓名时打开老人信息列表
  openOldMan() {
    this.oldManIsVisible = true;
  }
  // 返回
  back() {
    history.back();
  }
}
