import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../../common/service/local.storage";

class OutWarehouse {
  outMedDrugsId: string;
  batchNum: string;
  mdBatchNum: string;
  outNum: number;
  comment: string;
  quantity: string; //剩余数量
  outMedDrugsName: string; //药品名称
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

  warehouseBatchAllChecked = false;
  warehouseBatchIndeterminate = false;

  //根据当前要出库的仓库，查询到某个药品的入库批次的列表的加载状态；
  isWarehouseBatchTableLoading = false;
  //根据当前要出库的仓库，查询到某个药品的入库批次的列表；
  warehouseBatchList = [];
  //药品列表
  drugNameList = [];

  //控制是否显示添加药品对话框的状态
  isShowChooseGoodDialog = false;

  receiverList = []; //领用人员
  userInfo;
  validateForm;

  setionOfficeList = [];

  outMedDrugInfo = [];

  operatorUrl; //经办人签名
  receiverUrl; //经办人签名

  isBtnLoading = false; //保存按钮
  schedulingIdList = []; //获得的班组的列表
  recSchEmployeeList = []; //获得班组的人员的列表
  constructor(
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
      recDate: [new Date(), [Validators.required]], //领用时间
      sectionOfficeOutId: ["", [Validators.required]], //调拨科室
      receiver: [""], //领用人
      operator: ["", [Validators.required]], //操作人
      outComment: [""], //出库备注
      accountId: [""] //账户Id
    });

    this.validateForm.patchValue({
      operator: this.userInfo.name
    });
    // 获得所有得科室
    this.httpReq.post("/section_office/listAllOut", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        if (data["data"].length < 1) {
          this.message.error(data["message"]);
        } else {
          this.setionOfficeList = data["data"];
          this.validateForm.patchValue({
            sectionOfficeOutId: this.setionOfficeList[0].id
          });
        }
      }
    });
  }

  back() {
    history.back();
  }

  toScheDisplay = false;

  // 删除出库数据
  deleteOutWarehouse(i: OutWarehouse, e: MouseEvent): void {
    e.preventDefault();
    if (this.outMedDrugInfo.length > 0) {
      this.outMedDrugInfo = this.outMedDrugInfo.filter(d => d !== i);
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

    if (this.outMedDrugInfo.length == 0) {
      this.message.error("请添加出库药品！");
      return;
    }

    this.outMedDrugInfo.forEach(element => {
      if (
        (element.outNum <= 0 && element.quality == 0) ||
        element.outNum > element.quality
      ) {
        this.message.error("请输入正确的出库药品数量");
        return;
      }
    });

    let reqObj = this.validateForm.value;
    reqObj.accountId = this.userInfo.id;
    reqObj.outMedDrugInfo = this.outMedDrugInfo;
    reqObj.recDate = this.jsUtils.dateFormat(
      reqObj.recDate,
      "YYYY-MM-DD HH:mm:ss"
    );
    reqObj.operatorUrl = operatorUrl;
    reqObj.receiverUrl = receiverUrl;

    this.isBtnLoading = true;
    this.httpReq.post("/out_med_drug/saveOrUpdate", null, reqObj, data => {
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
   * 显示选择药品列表对话框
   */
  showChooseGoodsDialog() {
    this.drugNameList = [];
    this.isShowChooseGoodDialog = true;
    // 获得药品信息
    this.httpReq.post("/med_drug/listAll", null, {}, data => {
      if (data["code"] == 0) {
        this.drugNameList = data["data"];
      } else {
        this.message.error(data.message);
      }
    });
  }
  /**
   * 选择某个要出库药品时的监听
   */
  onSelectedGoodChange(event) {
    this.isWarehouseBatchTableLoading = true;
    this.warehouseBatchAllChecked = false;
    if (this.queryWarehouseBatchListParam.outGoodId == null) {
      this.isWarehouseBatchTableLoading = false;
      this.warehouseBatchList = [];
    } else {
      this.warehouseBatchList = [];
      this.drugNameList.forEach(element => {
        if (element.id == this.queryWarehouseBatchListParam.outGoodId)
          // 获得批次号
          this.httpReq.post(
            "/out_med_drug/listByMd",
            null,
            { medDrugsId: element.id },
            data => {
              this.isWarehouseBatchTableLoading = false;
              if (data["code"] == 0) {
                this.warehouseBatchList = data["data"];
              } else {
                this.message.error(data.message);
              }
            }
          );
      });
    }
  }

  /**
   * 选择完药品后点击的保存按钮
   */
  choosedGoods() {
    for (var i = 0; i < this.warehouseBatchList.length; i++) {
      const data = this.warehouseBatchList[i];
      if (data.checked) {
        if (data.quantity == 0) {
          this.message.error("库存不足");
          break;
        } else {
          let temp = new OutWarehouse();
          temp.outMedDrugsId = data.medDrug.id;
          temp.batchNum = data.batchNum;
          temp.outMedDrugsName = data.medDrug.drugName;
          temp.quantity = data.quantity;
          temp.mdBatchNum = data.mdBatchNum;
          temp.outNum = 1;
          this.outMedDrugInfo = [...this.outMedDrugInfo, temp];
          this.isShowChooseGoodDialog = false;
        }
      }
    }
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

  // 选择调拨药房时显示领用人员
  onSectionOfficeChange() {
    // 获得领用人员
    this.httpReq.post(
      "/out_med_drug/listReceiverBySo",
      null,
      { sectionOfficeRecId: this.validateForm.get("sectionOfficeOutId").value },
      data => {
        if (data["code"] == 0) {
          this.receiverList = data["data"];
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
}
