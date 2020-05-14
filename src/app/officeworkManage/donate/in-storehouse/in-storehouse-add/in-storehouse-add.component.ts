import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";
import { LocalStorage } from "../../../../common/service/local.storage";

@Component({
  selector: "app-in-storehouse-add",
  templateUrl: "./in-storehouse-add.component.html",
  styleUrls: ["./in-storehouse-add.component.css"]
})
export class InStorehouseAddComponent implements OnInit {
  formatterDollar = value => `￥ ${value}`;
  parserDollar = value => value.replace("￥ ", "");
  selectedGoods = {
    goodsName: "",
    autoNum: 1,
    inGoodsId: "",
    inNum: 1,
    productionDate: "",
    shelfLife: "",
    goodsComment: "",
    inGoodsModel: "",
    inGoodsUnit: "",
    inGoodsClassification: ""
  };
  //用于传递当前编辑的物品的下标位，-1为添加模式
  modifyGoodIndex = -1;
  //是否显示编辑物品对话框状态
  isShowSaveGoodsDialog = false;
  userInfo;
  validateForm;

  //库房列表
  storehouseList = [];

  //物品列表
  goodsList = [];

  //添加的入库物品列表
  inGoodsList = [];

  departmentList = [];
  isBtnLoading = false;

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage,
    private jsUtils: JsUtilsService
  ) {
    this.goodsList = [];
  }

  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    console.log("tag", this.userInfo);
    this.validateForm = this.fb.group({
      whInId: ["", [Validators.required]],
      useDepartmentId: ["", []],
      inDate: [new Date(), [Validators.required]],
      donatedCompany: ["", [Validators.required]],
      donatedDate: ["", [Validators.required]],
      useFor: ["", []],
      accountId: [this.userInfo.id, []],
      accountName: [this.userInfo.name, []],
      inComment: ["", []]
    });

    this.httpReq.post(
      "/donatedWarehouse/listAllByAccounts",
      null,
      { accountId: this.userInfo.id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.storehouseList = data["data"];
          console.log("tag", this.storehouseList);
        }
      }
    );

    this.httpReq.post("donatedGoods/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });

    this.httpReq.post("department/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.departmentList = data["data"];
      }
    });
  }

  back() {
    history.back();
  }

  onGoodsChange(value: string): void {
    this.selectedGoods.inNum = 0;
    this.selectedGoods.inGoodsClassification = "";
    this.selectedGoods.inGoodsModel = "";
    this.selectedGoods.inGoodsUnit = "";
    this.selectedGoods.shelfLife = "";
    this.selectedGoods.productionDate = "";
    this.selectedGoods.goodsComment = "";
    this.goodsList.forEach(element => {
      if (element.id == value) {
        if (Utils.isNotEmpty(element.name)) {
          this.selectedGoods.goodsName = element.name;
        }
        if (Utils.isNotEmpty(element.model)) {
          this.selectedGoods.inGoodsModel = element.model;
        }
        if (Utils.isNotEmpty(element.unit)) {
          this.selectedGoods.inGoodsUnit = element.unit;
        }

        if (
          element.donatedGoodsCategory &&
          Utils.isNotEmpty(element.donatedGoodsCategory.name)
        ) {
          this.selectedGoods.inGoodsClassification =
            element.donatedGoodsCategory.name;
        }
        if (Utils.isNotEmpty(element.shelfLife)) {
          this.selectedGoods.shelfLife = element.shelfLife;
        }
      }
    });
  }

  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    if (this.inGoodsList.length == 0) {
      this.message.error("请添加入库物品！");
      return;
    }

    this.inGoodsList.forEach(element => {
      element.productionDate = this.jsUtils.dateFormat(element.productionDate);
    });

    let reqObj = this.validateForm.value;
    reqObj.accountId = this.userInfo.id;
    reqObj.inDonatedWarehouseDesc = this.inGoodsList;
    reqObj.inDate = this.jsUtils.dateFormat(
      reqObj.inDate,
      "YYYY-MM-DD HH:mm:ss"
    );
    reqObj.donatedDate = this.jsUtils.dateFormat(
      reqObj.donatedDate,
      "YYYY-MM-DD"
    );

    this.isBtnLoading = true;
    this.httpReq.post("inDonatedWarehouse/save", null, reqObj, data => {
      this.isBtnLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        } else {
          this.message.error(data.message);
        }
      }
    });
  }

  showSaveGoodsDialog(goodsInfo, index) {
    this.modifyGoodIndex = index;
    this.selectedGoods = {
      goodsName: "",
      autoNum: 1,
      inGoodsId: "",
      inNum: 0,
      productionDate: "",
      shelfLife: "",
      goodsComment: "",
      inGoodsModel: "",
      inGoodsUnit: "",
      inGoodsClassification: ""
    };
    if (goodsInfo) {
      this.selectedGoods = goodsInfo;
    }

    //添加模式，编号按照当前物品列表数量+1
    if (index == -1) {
      if (this.inGoodsList.length > 0) {
        this.selectedGoods.autoNum = this.inGoodsList.length + 1;
      }
    } else {
      this.selectedGoods.autoNum = index + 1;
    }
    this.isShowSaveGoodsDialog = true;
  }

  /**
   * 添加入库物品详情
   */
  doDialogSave() {
    if (Utils.isEmpty(this.selectedGoods.inGoodsId)) {
      this.message.error("请选择需要入库的物品！");
      return;
    }

    if (
      Utils.isEmpty(this.selectedGoods.inNum) ||
      this.selectedGoods.inNum <= 0
    ) {
      this.message.error("请选择输入入库物品数量！");
      return;
    }
    if (this.modifyGoodIndex == -1) {
      this.inGoodsList.push(this.selectedGoods);
    } else {
      this.inGoodsList.splice(this.modifyGoodIndex, 1, this.selectedGoods);
    }
    this.isShowSaveGoodsDialog = false;
  }
  /**
   * 删除某个物品
   */
  deleteInGood(index) {
    this.inGoodsList.splice(index, 1);
    this.isShowSaveGoodsDialog = false;
    this.inGoodsList.forEach((element, index) => {
      element.autoNum = index + 1;
    });
  }
}
