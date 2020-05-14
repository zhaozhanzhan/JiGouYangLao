/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-05 14:51:37
 * @Description:
 */
import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
  isSaveLoading = false;
  user;
  validateForm: FormGroup;
  formatterYuan = value => `￥ ${value}`;
  parserYuan = value => value.replace("￥ ", "");

  //需要修改的月度计费对象
  editFeeMonth = {
    key: "",
    price: 0,
    edit: false,
    month: ""
  };
  //月度计费的单价列表
  feeMonthList = [];

  //编辑模式下的项目ID
  editItemId = "";

  //配置周期计费的持续时长
  duration = 0;
  // 配置的计费日期
  selectedValuationMonthDay = "30";
  //月周期计费的，计费日期
  valuationMonthDay = [];
  //日折算价
  dayDiscountPrice = 0;

  //费用账目列表
  feeCategory = [];
  //缴存账目列表
  feeAccount = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    for (let index = 1; index <= 28; index++) {
      this.valuationMonthDay.push({
        index: String(index),
        date: "每月" + index + "号"
      });
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      itemCode: [null, []],
      itemName: [null, [Validators.required]],
      expCategoryId: [null, [Validators.required]],
      unitPrice: [0, [Validators.required]],
      specs: [null, [Validators.required]],
      chargeMode: [["1"], [Validators.required]],
      feeMode: ["1", [Validators.required]],
      depositAccountsId: [null, []],
      depositAccountsSpareId: [null, []],
      sort: [0]
    });

    this.route.params.subscribe((params: Params) => {
      const infoStr = params["info"];
      if (infoStr != "{}") {
        let itemInfo = JSON.parse(infoStr);
<<<<<<< HEAD
        // const chargeModeList = itemInfo.chargeMode.split(",");
        console.log(itemInfo.chargeMode);
=======
        console.log(itemInfo.chargeMode);
        // const chargeModeList = itemInfo.chargeMode.split(",");
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
        this.editItemId = itemInfo.id;
        this.validateForm.patchValue({
          itemCode: itemInfo.itemCode, //项目代码
          itemName: itemInfo.itemName, //项目名称
          expCategoryId: itemInfo.expCategoryInfo.id, //消费类别id
          unitPrice: String(itemInfo.unitPrice), //单价
          specs: itemInfo.specs, //规格
<<<<<<< HEAD
          // chargeMode: chargeModeList, //收费方式:[1:现结]、[2:代扣]
          feeMode: String(itemInfo.feeMode), //计费方式:[1:登记计费]、[2:按月计费]、[3:按日计费]
          depositAccountsId: itemInfo.depositAccountsInfo.id, //扣款账目id
          depositAccountsSpareId: itemInfo.depositAccountsSpareInfo.id, //备选扣款账目id
          sort: String(itemInfo.sort)
        });
        this.selectedValuationMonthDay = String(itemInfo.feeDateValue);
        this.dayDiscountPrice = itemInfo.dailyPrice
          ? itemInfo.dailyPrice
          : 0;
=======
          chargeMode: itemInfo.chargeMode, //收费方式:[1:现结]、[2:代扣]
          feeMode: String(itemInfo.feeMode), //计费方式:[1:登记计费]、[2:按月计费]、[3:按日计费]
          depositAccountsId: itemInfo.depositAccountsInfo.id, //扣款账目id
          depositAccountsSpareId: "", //备选扣款账目id
          sort: String(itemInfo.sort)
        });
        this.change();
        if (itemInfo.depositAccountsSpareInfo == null) {
          this.validateForm.patchValue({
            depositAccountsSpareId: "" //备选扣款账目id
          });
        } else {
          this.validateForm.patchValue({
            depositAccountsSpareId: itemInfo.depositAccountsSpareInfo.id //备选扣款账目id
          });
        }
        this.selectedValuationMonthDay = String(itemInfo.feeDateValue);
        this.dayDiscountPrice = itemInfo.dailyPrice ? itemInfo.dailyPrice : 0;
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
        this.duration = itemInfo.duration;
        if (!Utils.isEmpty(itemInfo.unitPriceCfg)) {
          let unitPriceCfgInfo = JSON.parse(itemInfo.unitPriceCfg);
          this.feeMonthList.push(
            {
              key: "0",
              price: unitPriceCfgInfo.Jan,
              edit: false,
              month: "一月"
            },
            {
              key: "1",
              price: unitPriceCfgInfo.Feb,
              edit: false,
              month: "二月"
            },
            {
              key: "2",
              price: unitPriceCfgInfo.Mar,
              edit: false,
              month: "三月"
            },
            {
              key: "3",
              price: unitPriceCfgInfo.Apr,
              edit: false,
              month: "四月"
            },
            {
              key: "4",
              price: unitPriceCfgInfo.May,
              edit: false,
              month: "五月"
            },
            {
              key: "5",
              price: unitPriceCfgInfo.Jun,
              edit: false,
              month: "六月"
            },
            {
              key: "6",
              price: unitPriceCfgInfo.Jul,
              edit: false,
              month: "七月"
            },
            {
              key: "7",
              price: unitPriceCfgInfo.Aug,
              edit: false,
              month: "八月"
            },
            {
              key: "8",
              price: unitPriceCfgInfo.Sep,
              edit: false,
              month: "九月"
            },
            {
              key: "9",
              price: unitPriceCfgInfo.Oct,
              edit: false,
              month: "十月"
            },
            {
              key: "10",
              price: unitPriceCfgInfo.Nov,
              edit: false,
              month: "十一月"
            },
            {
              key: "11",
              price: unitPriceCfgInfo.Dec,
              edit: false,
              month: "十二月"
            }
          );
        }
      }
    });

    this.loadingFeeCategoryArray();
    this.loadingFeeAccountArray();
  }
  //是否是代扣的收费方式
  isAccountPayShow = false;
<<<<<<< HEAD
  change(e) {
    console.log(e);
=======
  change() {
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
    const chargeModeList = this.validateForm.value.chargeMode;
    if (chargeModeList[1] == "2" || chargeModeList[0] == "2") {
      this.isAccountPayShow = true;
    }
  }
  back() {
    history.back();
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    this.user = this.localStorage.getUser();

    let feeDateType = 1;
    if (this.selectedValuationMonthDay == "0") {
      feeDateType = 1;
    } else if (this.selectedValuationMonthDay == "30") {
      feeDateType = 3;
    } else {
      feeDateType = 2;
    }

    let saveParam = {
      id: this.editItemId, //消费项目id
      itemCode: this.validateForm.value.itemCode, //项目代码
      itemName: this.validateForm.value.itemName, //项目名称
      expCategoryId: this.validateForm.value.expCategoryId, //消费类别id
      unitPrice: Number(this.validateForm.value.unitPrice), //单价
      specs: this.validateForm.value.specs, //规格
      chargeMode: this.validateForm.value.chargeMode.join(","), //收费方式:[1:现结]、[2:代扣]
      feeMode: Number(this.validateForm.value.feeMode), //计费方式:[1:登记计费]、[2:按月计费]、[3:按日计费]
      feeDateType: feeDateType, //计费日期类型(默认1):[1:月末]、[2:自然月1-28号]、[3:每隔30日]
      feeDateValue: Number(this.selectedValuationMonthDay), //计费日期(计费日期类型为2时必填):1-28
      dailyPrice: Number(this.dayDiscountPrice), //日折算价(计费方式为2时必填)
      unitPriceCfg: {},
      duration: Number(this.duration), //持续期（日/月）(默认不限):'[0:不限]、[1-N:持续期的值]'
      depositAccountsId: this.validateForm.value.depositAccountsId, //扣款账目id
      depositAccountsSpareId: this.validateForm.value.depositAccountsSpareId, //备选扣款账目id
      sort: Number(this.validateForm.value.sort), //排序号
      comment: "", //备注
      accountId: this.user.id //账户id
    };

    if (this.feeMonthList.length == 12) {
      saveParam.unitPriceCfg = {
        Jan: this.feeMonthList[0].price,
        Feb: this.feeMonthList[1].price,
        Mar: this.feeMonthList[2].price,
        Apr: this.feeMonthList[3].price,
        May: this.feeMonthList[4].price,
        Jun: this.feeMonthList[5].price,
        Jul: this.feeMonthList[6].price,
        Aug: this.feeMonthList[7].price,
        Sep: this.feeMonthList[8].price,
        Oct: this.feeMonthList[9].price,
        Nov: this.feeMonthList[10].price,
        Dec: this.feeMonthList[11].price
      };
    }

    //收费方式为现结的时候，计费方式只能为登记计费
    if (saveParam.chargeMode == 1) {
      saveParam.feeMode = 1;
    }
    //收费方式代扣时，判断是否输入主、备扣款账目
    if (this.isAccountPayShow == true) {
      if (saveParam.depositAccountsId == null) {
        this.message.warning("请选择主扣款账目！");
        return;
      }
      if (saveParam.depositAccountsId == saveParam.depositAccountsSpareId) {
        this.message.warning("主扣款账目和备扣款账目不能设置同一个！");
        return;
      }
    }
    //收费方式代扣时，判断是否输入主、备扣款账目
    // if (saveParam.chargeMode == 2) {
    //   if (saveParam.depositAccountsId == null) {
    //     this.message.warning("请选择主扣款账目！");
    //     return;
    //   }
    //   if (saveParam.depositAccountsId == saveParam.depositAccountsSpareId) {
    //     this.message.warning("主扣款账目和备扣款账目不能设置同一个！");
    //     return;
    //   }
    // }
    this.isSaveLoading = true;
    this.httpReq.post("expItem/saveOrUpdate", null, saveParam, data => {
      this.isSaveLoading = false;
      if (data["code"] == 0) {
        this.back();
      }
    });
  }

  pdateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  /**
   * 加载消费类别列表数据
   */
  loadingFeeCategoryArray() {
    const queryParams = {
      name: ""
    };
    this.httpReq.post("expCategory/listAll", null, queryParams, data => {
      if (data["code"] == 0) {
        this.feeCategory = data["data"];
      }
    });
  }

  /**
   * 加载缴存账目列表数据
   */
  loadingFeeAccountArray() {
    const queryParams = {
      name: ""
    };
    this.httpReq.post("depositAccounts/listAll", null, queryParams, data => {
      if (data["code"] == 0) {
        this.feeAccount = data["data"];
      }
    });
  }

  /**
   * 单价输入监听
   */
  feeModeChange(mode) {
    console.log("tag", mode);
    let value = this.validateForm.value.unitPrice;
    if (mode == 2 && this.feeMonthList.length === 0) {
      this.feeMonthList.push(
        {
          key: "0",
          price: value,
          edit: false,
          month: "一月"
        },
        {
          key: "1",
          price: value,
          edit: false,
          month: "二月"
        },
        {
          key: "2",
          price: value,
          edit: false,
          month: "三月"
        },
        {
          key: "3",
          price: value,
          edit: false,
          month: "四月"
        },
        {
          key: "4",
          price: value,
          edit: false,
          month: "五月"
        },
        {
          key: "5",
          price: value,
          edit: false,
          month: "六月"
        },
        {
          key: "6",
          price: value,
          edit: false,
          month: "七月"
        },
        {
          key: "7",
          price: value,
          edit: false,
          month: "八月"
        },
        {
          key: "8",
          price: value,
          edit: false,
          month: "九月"
        },
        {
          key: "9",
          price: value,
          edit: false,
          month: "十月"
        },
        {
          key: "10",
          price: value,
          edit: false,
          month: "十一月"
        },
        {
          key: "11",
          price: value,
          edit: false,
          month: "十二月"
        }
      );
    }
  }
}
