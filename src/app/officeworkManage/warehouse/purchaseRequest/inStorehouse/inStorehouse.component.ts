import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";

@Component({
  selector: "app-inStorehouse",
  templateUrl: "./inStorehouse.component.html",
  styleUrls: ["./inStorehouse.component.css"]
})
export class RequestInStorehouseComponent implements OnInit {
  formatterDollar = value => `￥ ${value}`;
  parserDollar = value => value.replace("￥ ", "");
  selectedGoods = {
    reGoodsId: "",
    goodsName: "",
    autoNum: 1,
    inGoodsId: "",
    inNum: 0,
    singlePrice: "",
    requisitionDate: "",
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

  isBtnLoading = false;

  //采购申请单Id
  requestId = "";
  requsetInfo = {
    rid: "",
    title: "",
    resource: ""
  };
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
    this.requestId = this.route.snapshot.paramMap.get("requestId");
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    console.log("tag", this.userInfo);
    this.validateForm = this.fb.group({
      orderId: ["", [Validators.required]],
      whInId: ["", [Validators.required]],
      inDate: [new Date(), [Validators.required]],
      inSource: ["", [Validators.required]],
      accountId: [this.userInfo.id, []],
      accountName: [this.userInfo.name, []],
      inComment: ["", []]
    });

    let that = this;
    if (!Utils.isEmpty(this.requestId)) {
      let reqParam = { requisitionId: this.requestId };
      this.httpReq.post("requisition/listDetail", null, reqParam, data => {
        if (data["code"] == 0) {
          let resultData = data["data"];
          this.requsetInfo.rid = resultData.rid;
          this.requsetInfo.title = resultData.title;

          this.goodsList = [];
          resultData.requisitionGoods.forEach(element => {
            if (element.isInWh == 0) {
              element.isSelected = false;
              this.goodsList.push(element);
            }
          });
          this.requsetInfo.resource = "采购申请单" + resultData.rid + "入库";
          //根据申请单来检索对应申请部门的仓库列表
          let departmentId = resultData.department.id;
          that.httpReq.post(
            "warehouse/listAllByDept",
            null,
            { deptId: departmentId },
            data => {
              if (data["status"] == 200 && data["code"] == 0) {
                that.storehouseList = data["data"];
              }
            }
          );
        }
      });
    }
  }

  back() {
    history.back();
  }

  onGoodsChange(value: string): void {
    this.goodsList.forEach(element => {
      if (element.id == value) {
        this.selectedGoods.reGoodsId = element.id;
        this.selectedGoods.inNum = element.rGoodsNum;
        this.selectedGoods.requisitionDate = element.createDate;
        if (Utils.isNotEmpty(element.rGoods.name)) {
          this.selectedGoods.goodsName = element.rGoods.name;
        }
        if (Utils.isNotEmpty(element.rGoods.id)) {
          this.selectedGoods.inGoodsId = element.rGoods.id;
        }
        if (Utils.isNotEmpty(element.rGoods.model)) {
          this.selectedGoods.inGoodsModel = element.rGoods.model;
        }
        if (Utils.isNotEmpty(element.rGoods.unit)) {
          this.selectedGoods.inGoodsUnit = element.rGoods.unit;
        }

        if (
          element.rGoods.goodsCategory &&
          Utils.isNotEmpty(element.rGoods.goodsCategory.name)
        ) {
          this.selectedGoods.inGoodsClassification =
            element.rGoods.goodsCategory.name;
        }
        if (Utils.isNotEmpty(element.rGoodsPrice)) {
          this.selectedGoods.singlePrice = element.rGoodsPrice;
        }
        if (Utils.isNotEmpty(element.rGoods.shelfLife)) {
          this.selectedGoods.shelfLife = element.rGoods.shelfLife;
        }
      }
    });
  }

  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.inGoodsList.length == 0) {
      this.message.error("请添加入库物品！");
      return;
    }

    this.inGoodsList.forEach(element => {
      element.productionDate = this.jsUtils.dateFormat(element.productionDate);
    });
    let reqObj = this.validateForm.value;
    reqObj.requisitionId = this.requestId;
    reqObj.accountId = this.userInfo.id;
    reqObj.inWarehouseDesc = this.inGoodsList;
    reqObj.inDate = this.jsUtils.dateFormat(
      reqObj.inDate,
      "YYYY-MM-DD HH:mm:ss"
    );
    console.log(JSON.stringify(reqObj));

    this.isBtnLoading = true;
    this.httpReq.post("requisition/requisitionInWh", null, reqObj, data => {
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
      reGoodsId: "",
      goodsName: "",
      autoNum: 1,
      inGoodsId: "",
      inNum: 0,
      singlePrice: "",
      requisitionDate: "",
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
    if (Utils.isEmpty(this.selectedGoods.reGoodsId)) {
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

    console.log("tag", this.selectedGoods);
    console.log("tag", this.goodsList);
    console.log("tag", this.inGoodsList);

    this.goodsList.forEach(element => {
      if (element.id == this.selectedGoods.reGoodsId) {
        element.isSelected = true;
      }
    });
  }
  /**
   * 删除某个物品
   */
  deleteInGood(index) {
    let deleteReGoodId = this.inGoodsList[index].reGoodsId;
    this.inGoodsList.splice(index, 1);
    this.goodsList.forEach(element => {
      if (element.id == deleteReGoodId) {
        element.isSelected = false;
      }
    });
    this.isShowSaveGoodsDialog = false;
  }
}
