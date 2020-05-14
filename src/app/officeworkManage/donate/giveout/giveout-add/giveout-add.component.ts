import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";
import { LocalStorage } from "../../../../common/service/local.storage";

class OutWarehouse {
  outGoodsId: string;
  batchNum: string;
  goodName: string;
  shelfLife: string;
  expireDate: string;
  outNum: number;
  goodsComment: string;
  quality: string;
  donatedCompany: string;
  donatedDate: string;
  goodComment: string;
  productionDate: string;
  useFor: string;
  version: string;
}

@Component({
  selector: "app-giveout-add",
  templateUrl: "./giveout-add.component.html",
  styleUrls: ["./giveout-add.component.css"]
})
export class GiveoutAddComponent implements OnInit {
  queryWarehouseBatchListParam = {
    whId: "",
    outGoodId: ""
  };

  warehouseBatchAllChecked = false;
  warehouseBatchIndeterminate = false;

  //根据当前要出库的仓库，查询到某个物品的入库批次的列表的加载状态；
  isWarehouseBatchTableLoading = false;
  //根据当前要出库的仓库，查询到某个物品的入库批次的列表；
  warehouseBatchList = [];
  //物品列表
  goodsList = [];

  //控制是否显示添加物品对话框的状态
  isShowChooseGoodDialog = false;
  userInfo;
  validateForm;

  storehouseList = [];
  storehouseListOfDept = [];
  departmentList = [];
  inventoryListOfWhOut = [];

  outWarehouseDesc = [];

  operatorUrl;
  receiverUrl; // 领用人

  isBtnLoading = false;

  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage,
    private jsUtils: JsUtilsService
  ) {}

  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.validateForm = this.fb.group({
      whOutId: [undefined, [Validators.required]],
      recDeptId: ["", [Validators.required]],
      schedulingId: ["", []],
      toSche: ["false", [Validators.required]],
      receiver: ["", []],
      recTime: [new Date(), [Validators.required]],
      outComment: ["", []],
      useFor: ["", []],
      recSchEmployee: [""]
    });

    this.httpReq.post(
      "/donatedWarehouse/listAllByAccounts",
      null,
      { accountId: this.userInfo.id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.storehouseList = data["data"];
        }
      }
    );

    this.httpReq.post("department/listAll", null, {}, data => {
      if (data["status"] == 200) {
        this.departmentList = data["data"];
      }
    });
  }

  back() {
    history.back();
  }

  onWhOutChange(whOutId: string): void {
    this.httpReq.post(
      "donatedInventory/listAllByWh",
      null,
      { whId: whOutId },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.inventoryListOfWhOut = data["data"];
        }
      }
    );
  }

  toScheDisplay = false;
  changeToSche() {
    if (this.validateForm.get("toSche").value == "false") {
      this.schedulingIdList = [];
      this.recSchEmployeeList = [];
      this.validateForm.patchValue({ schedulingId: "" });
      this.validateForm.patchValue({ recSchEmployee: "" });
      this.toScheDisplay = false;
    } else {
      this.validateForm.patchValue({ receiver: "" });
      this.toScheDisplay = true;
    }
  }

  schedulingIdList = [];
  recSchEmployeeList = [];
  onRecDeptChange(recDeptId: string): void {
    if (Utils.isEmpty(recDeptId)) {
      return;
    }
    this.validateForm.patchValue({ whInId: "" });
    this.validateForm.patchValue({ schedulingId: "" });
    const reqObj = {
      deptId: recDeptId,
      outWhId: this.validateForm.get("whOutId").value
    };
    this.schedulingIdList = [];
    this.recSchEmployeeList = [];

    this.validateForm.patchValue({ recSchEmployee: "" });
    this.httpReq.post(
      "donatedWarehouse/listAllByDeptAndOutWh",
      null,
      reqObj,
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.storehouseListOfDept = data["data"];
        }
      }
    );

    this.httpReq.post(
      "/outWarehouse/listScheByDept",
      null,
      { departmentId: this.validateForm.get("recDeptId").value },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.schedulingIdList = data["data"];
        }
      }
    );
  }
  getSchedlingPeople(recDeptId: string) {
    this.recSchEmployeeList = [];
    this.validateForm.patchValue({ recSchEmployee: "" });
    this.httpReq.post(
      "/outWarehouse/listRecByDeptOrSche",
      null,
      { schedulingId: this.validateForm.get("schedulingId").value },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.recSchEmployeeList = data["data"];
          console.log(data["data"]);
          console.log(this.schedulingIdList);
        }
      }
    );
  }
  onGoodsChange(value: string, inWarehouse): void {
    this.inventoryListOfWhOut.forEach(element => {
      if (element.goods.id == value) {
        inWarehouse.outGoodsModel = element.goods.model;
        inWarehouse.outGoodsUnit = element.goods.unit;
        inWarehouse.outGoodsClassification = element.goods.goodsCategory.name;
        inWarehouse.outGoodsQuantity = element.quantity;
      }
    });
  }

  deleteOutWarehouse(i: OutWarehouse, e: MouseEvent): void {
    e.preventDefault();
    if (this.outWarehouseDesc.length > 0) {
      this.outWarehouseDesc = this.outWarehouseDesc.filter(d => d !== i);
    }
  }

  saveForm(operatorUrl, receiverUrl) {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    if (this.outWarehouseDesc.length == 0) {
      this.message.error("请添加领用物品！");
      return;
    }
    this.outWarehouseDesc.forEach(element => {
      if (element.outNum <= 0 || element.outNum > element.quality) {
        this.message.error("请输入正确的领用物品数量");
        return;
      }
    });

    if (this.validateForm.get("toSche").value == "false") {
      if (this.validateForm.get("receiver").value == "") {
        this.message.error("请输入领用人员");

        return;
      }
    } else {
      if (
        this.validateForm.get("recSchEmployee").value == "" ||
        this.validateForm.get("schedulingId").value == ""
      ) {
        this.message.error("请输入班组领用人员或领用班组");
        console.log("=========请输入班组领用人员==========");
        return;
      }
    }
    let reqObj = this.validateForm.value;
    reqObj.accountId = this.userInfo.id;
    reqObj.outDonatedWarehouseDesc = this.outWarehouseDesc;
    reqObj.recTime = this.jsUtils.dateFormat(
      reqObj.recTime,
      "YYYY-MM-DD HH:mm:ss"
    );
    reqObj.operatorUrl = operatorUrl;
    reqObj.receiverUrl = receiverUrl; // 领用人签名图片

    this.isBtnLoading = true;
    this.httpReq.post("outDonatedWarehouse/saveSend", null, reqObj, data => {
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

  /**
   * 显示选择物品列表对话框
   */
  showChooseGoodsDialog() {
    this.goodsList = [];
    this.warehouseBatchList = [];
    this.queryWarehouseBatchListParam.outGoodId = "";
    this.warehouseBatchAllChecked = false;
    console.log(this.validateForm.value.whOutId);
    let whOutId = this.validateForm.value.whOutId;
    if (Utils.isEmpty(whOutId)) {
      this.message.error("请先选择要出库的库房！");
      return;
    }
    this.queryWarehouseBatchListParam.whId = whOutId;
    this.isShowChooseGoodDialog = true;

    this.httpReq.post(
      "outDonatedWarehouse/listOutGoods",
      null,
      {
        whId: whOutId,
        wdId: this.validateForm.get("recDeptId").value
      },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          let result = JSON.parse(data["data"]);
          this.goodsList = result;
        }
      }
    );
  }
  /**
   * 选择某个要出库物品时的监听
   */
  onSelectedGoodChange() {
    let that = this;
    that.warehouseBatchList = [];
    this.isWarehouseBatchTableLoading = true;
    this.httpReq.post(
      "outDonatedWarehouse/listOutGoodsBatchNum",
      null,
      this.queryWarehouseBatchListParam,
      data => {
        this.isWarehouseBatchTableLoading = false;
        if (data["code"] == 0) {
          let batchListTemp = JSON.parse(data["data"]);
          console.log("tag", batchListTemp);
          that.warehouseBatchList = batchListTemp;
          this.warehouseBatchList.forEach(data => {
            data.id = that.queryWarehouseBatchListParam.outGoodId;
            data.checked = false;
          });
        }
      }
    );
  }

  /**
   * 选择完物品后点击的保存按钮
   */
  choosedGoods() {
    this.warehouseBatchList.forEach(data => {
      if (data.checked) {
        console.log("tag", data);
        let temp = new OutWarehouse();
        temp.outGoodsId = data.id;
        temp.batchNum = data.batchNum;
        temp.goodName = data.goodName;
        temp.shelfLife = data.shelfLife;
        temp.expireDate = data.expireDate;
        temp.quality = data.quality;
        temp.donatedCompany = data.donatedCompany;
        temp.donatedDate = data.donatedDate;
        temp.goodComment = data.goodComment;
        temp.productionDate = data.productionDate;
        temp.useFor = data.useFor;
        temp.version = data.version;
        temp.outNum = 1;
        this.outWarehouseDesc = [...this.outWarehouseDesc, temp];
      }
    });
    this.isShowChooseGoodDialog = false;
  }

  currentPageDataChange(
    $event: Array<{
      name: string;
      age: number;
      address: string;
      checked: boolean;
      disabled: boolean;
    }>
  ): void {
    this.warehouseBatchList = $event;
    this.refreshStatus();
  }
  refreshStatus(): void {
    const allChecked = this.warehouseBatchList
      .filter(value => !value.disabled)
      .every(value => value.checked === true);
    const allUnChecked = this.warehouseBatchList
      .filter(value => !value.disabled)
      .every(value => !value.checked);
    this.warehouseBatchAllChecked = allChecked;
    this.warehouseBatchIndeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.warehouseBatchList.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
}
