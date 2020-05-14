import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";
import { LocalStorage } from "../../../../common/service/local.storage";
import { ImageUploadComponent } from "src/app/common/imageupload/imageupload.component";
import * as _ from "underscore"; // Underscore工具类

class OutWarehouse {
  outGoodsId: string;
  batchNum: string;
  goodName: string;
  requisitionDate: string;
  inPrice: string;
  shelfLife: string;
  expireDate: string;
  outNum: number;
  goodsComment: string;
  quality: string;
  version: string;
}

@Component({
  selector: "app-out-storehouse-add",
  templateUrl: "./out-storehouse-add.component.html",
  styleUrls: ["./out-storehouse-add.component.css"]
})
export class OutStorehouseAddComponent implements OnInit {
  queryWarehouseBatchListParam = {
    whId: "",
    outGoodId: ""
  };
  public tplModal: NzModalRef;
  @ViewChild("uploadImg")
  public uploadImg: ImageUploadComponent;
  url;
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
  whCategoryOutList = [];
  departmentList = [];
  inventoryListOfWhOut = [];

  outWarehouseDesc = [];
  selectCategoryId;

  operatorUrl;
  receiverUrl;

  isBtnLoading = false;
  isWhCategoryOutId01 = false;
  schedulingIdList = []; //获得的班组的列表
  recSchEmployeeList = []; //获得班组的人员的列表
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage,
    private modalService: NzModalService, //提示
    private jsUtils: JsUtilsService
  ) {}

  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.validateForm = this.fb.group({
      whOutId: [undefined, [Validators.required]],
      recTime: [new Date(), [Validators.required]],
      whCategoryOutId: [undefined, [Validators.required]],
      receiver: [""],
      recDeptId: ["", [Validators.required]],
      outComment: ["", []],
      toSche: ["false", [Validators.required]],
      schedulingId: [""],
      recSchEmployee: [""]
    });

    this.httpReq.post(
      "warehouse/listAllByAccounts",
      null,
      { accountId: this.userInfo.id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.storehouseList = data["data"];
        }
      }
    );
  }

  back() {
    history.back();
  }

  onWhOutChange(whOutId: string): void {
    this.httpReq.post("outWarehouseCategory/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.whCategoryOutList = data["data"];
      }
    });

    this.httpReq.post(
      "inventory/listAllByWh",
      null,
      { whId: whOutId },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.inventoryListOfWhOut = data["data"];
        }
      }
    );
  }

  onWhCategoryOutChange(value: string): void {
    this.whCategoryOutList.forEach(element => {
      if (element.id == value) {
        this.selectCategoryId = element.categoryId;
      }
    });
    this.httpReq.post("department/listAll", null, {}, data => {
      if (data["status"] == 200) {
        this.departmentList = data["data"];
      }
    });
    if (this.selectCategoryId == "01") {
      this.isWhCategoryOutId01 = true;
      this.validateForm.patchValue({ toSche: "false" });
      this.validateForm.addControl(
        "whInId",
        this.fb.control("", [Validators.required])
      );
    } else if (this.selectCategoryId == "02") {
      this.isWhCategoryOutId01 = false;
      this.validateForm.patchValue({ whInId: "" });
      this.validateForm.removeControl("whInId");
    } else {
    }
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
    this.httpReq.post("warehouse/listAllByDeptAndOutWh", null, reqObj, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.storehouseListOfDept = data["data"];
      }
    });

    this.httpReq.post(
      "/outWarehouse/listScheByDept",
      null,
      { departmentId: this.validateForm.get("recDeptId").value },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.schedulingIdList = data["data"];
          console.log(data["data"]);
          console.log(this.schedulingIdList);
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

  saveForm(operatorUrl, receiverUrl, imageUrlStr) {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    if (this.outWarehouseDesc.length == 0) {
      this.message.error("请添加出库物品！");
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
        console.log("=========输入领用人员==========");
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
    reqObj.outWarehouseDesc = this.outWarehouseDesc;
    reqObj.recTime = this.jsUtils.dateFormat(
      reqObj.recTime,
      "YYYY-MM-DD HH:mm:ss"
    );
    reqObj.operatorUrl = operatorUrl;
    reqObj.receiverUrl = receiverUrl;
    reqObj.receiverPic = imageUrlStr;
    console.log("===========请求接口========");

    this.isBtnLoading = true;
    this.httpReq.post("outWarehouse/save", null, reqObj, data => {
      this.isBtnLoading = false;
      if (data["status"] == 200) {
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          console.log("===========保存成功！========");
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
    let whOutId = this.validateForm.value.whOutId;
    if (Utils.isEmpty(whOutId)) {
      this.message.error("请先选择要出库的库房！");
      return;
    }
    this.queryWarehouseBatchListParam.whId = whOutId;
    this.isShowChooseGoodDialog = true;

    this.httpReq.post(
      "outWarehouse/listOutGoods",
      null,
      { whId: whOutId },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          let result = JSON.parse(data["data"]);
          console.log(result + typeof result);
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
    this.isWarehouseBatchTableLoading = true;
    this.warehouseBatchAllChecked = false;
    this.httpReq.post(
      "outWarehouse/listOutGoodsBatchNum",
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
        temp.requisitionDate = data.requisitionDate;
        temp.inPrice = data.inPrice;
        temp.shelfLife = data.shelfLife;
        temp.expireDate = data.expireDate;
        temp.quality = data.quality;
        temp.outNum = 1;
        temp.version = data.version;
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

  /**
   * 显示图片上传模态框
   * @memberof IntraMedicationComponent
   */
  public showModal(
    tplTitle: TemplateRef<{}>,
    tplContent: TemplateRef<{}>,
    tplFooter: TemplateRef<{}>
  ): void {
    this.tplModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 900,
      nzOnOk: () => console.log("Click ok")
    });
  }

  /**
   * 模态框点击确定
   * @memberof IntraMedicationComponent
   */
  public handleOk(): void {
    console.log(this.uploadImg.showImageUrls);
    const imgUrlArr = this.uploadImg.showImageUrls;
    if (_.isArray(imgUrlArr) && imgUrlArr.length > 0) {
      this.url = imgUrlArr.join(",");
      console.log(this.url);
    } else {
      this.message.warning("请上传图片！");
    }
  }

  /**
   * 模态框点击取消
   * @memberof IntraMedicationComponent
   */
  public handleCancel(): void {
    this.tplModal.close();
  }
}
