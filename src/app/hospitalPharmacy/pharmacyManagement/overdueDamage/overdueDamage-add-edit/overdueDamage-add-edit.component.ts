import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";
import { LocalStorage } from "../../../../common/service/local.storage";
import { GlobalMethod } from "../../../../common/service/GlobalMethod";
@Component({
  selector: "app-overdueDamage-add-edit",
  templateUrl: "./overdueDamage-add-edit.component.html",
  styleUrls: ["./overdueDamage-add-edit.component.css"]
})
export class OverdueDamageAddEditComponent implements OnInit {
  selectedGoods = {
    drugName: "", //药品名称
    autoNum: 1, //第几个数据
    medDrugsId: "", //药品id,
    batchNum: "", //批次号
    mdBatchNum: "", //批号
    odNum: 1, //过期破损数量
    reason: "", //过期破损原因
    odComment: "", //药品备注
    manufacturers: "", //生产厂商
    specification: "", //药品规格
    inDate: "", //入库日期
    quantity: "", //剩余数量
    supplier: "" //供应商
  };
  //用于传递当前编辑的物品的下标位，-1为添加模式
  modifyGoodIndex = -1;
  //是否显示编辑物品对话框状态
  isShowSaveGoodsDialog = false;
  userInfo;
  validateForm;

  //科室列表
  setionOfficeList = [];

  //物品列表
  drugNameList = [];
  //批次号列表
  batchNumList = [];
  //添加的入库物品列表
  inGoodsList = [];

  isBtnLoading = false;
  showDisabled = false;
  constructor(
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage,
    private jsUtils: JsUtilsService
  ) {
    this.drugNameList = [];
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      operator: ["", [Validators.required]], //操作人
      odDate: [new Date(), [Validators.required]], //操作时间
      accountId: ["", []], //账户Id
      comment: ["", []] //备注
    });

    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.validateForm.patchValue({
      operator: this.userInfo.name
    });
    // 获得所有得科室
    this.httpReq.post("/section_office/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.setionOfficeList = data["data"];
      }
    });
  }

  back() {
    history.back();
  }

  onGoodsChange(value: string): void {
    this.batchNumList = [];
    this.mdBatchNumList = [];
    // 获得批次号
    this.httpReq.post(
      "/med_drug/listBatchNumByMd",
      null,
      { medDrugsId: this.selectedGoods.medDrugsId },
      data => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          const result = JSON.parse(data["data"]);
          this.batchNumList = result.BatchNumArray;
          this.selectedGoods.manufacturers = result.manufacturers;
          this.selectedGoods.specification = result.specification;
        } else {
          this.message.error(data.message);
        }
      }
    );
    this.drugNameList.forEach(element => {
      if (element.id == value) {
        // console.log(element);
        if (Utils.isNotEmpty(element.drugName)) {
          this.selectedGoods.drugName = element.drugName;
        }
      }
    });
  }

  // 保存过期破损药品
  saveForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "INVALID") {
      return;
    }

    if (this.inGoodsList.length == 0) {
      this.message.error("请添加过期破损药品！");
      return;
    }

    this.inGoodsList.forEach(element => {
      element.productionDate = this.jsUtils.dateFormat(element.productionDate);
    });
    let reqObj = this.validateForm.value;
    reqObj.accountId = this.userInfo.id;
    reqObj.mdOverdueDamageInfo = this.inGoodsList;
    reqObj.odDate = this.jsUtils.dateFormat(
      reqObj.odDate,
      "YYYY-MM-DD HH:mm:ss"
    );
    this.isBtnLoading = true;
    this.httpReq.post("/md_overdue_damage/saveOrUpdate", null, reqObj, data => {
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
    // 先判断是否选择了科室药房
    // 获得药品信息
    this.httpReq.post("/med_drug/listMdBySectionOffice", null, {}, data => {
      if (data["code"] == 0) {
        this.drugNameList = JSON.parse(data["data"]);
      } else {
        this.message.error(data.message);
      }
    });

    this.modifyGoodIndex = index;
    this.selectedGoods = {
      drugName: "", //药品名称
      autoNum: 1, //第几个数据
      medDrugsId: "", //药品id,
      batchNum: "", //批次号
      mdBatchNum: "", //批号
      odNum: 1, //过期破损数量
      reason: "", //过期破损原因
      odComment: "", //药品备注
      manufacturers: "", //生产厂商
      specification: "", //药品规格
      inDate: "", //入库日期
      quantity: "", //剩余数量
      supplier: "" //供应商
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
   * 添加过期破损药品详情
   */
  doDialogSave() {
    if (Utils.isEmpty(this.selectedGoods.medDrugsId)) {
      this.message.error("请选择需要过期破损的药品！");
      return;
    }

    if (
      Utils.isEmpty(this.selectedGoods.odNum) ||
      this.selectedGoods.odNum <= 0
    ) {
      this.message.error("过期破损数量不能为0！");
      return;
    }

    if (Utils.isEmpty(this.selectedGoods.batchNum)) {
      this.message.error("请选择批次号！");
      return;
    }

    if (Utils.isEmpty(this.selectedGoods.reason)) {
      this.message.error("请输入报废原因！");
      return;
    }

    if (this.modifyGoodIndex == -1) {
      this.inGoodsList.push(this.selectedGoods);
    } else {
      this.inGoodsList.splice(this.modifyGoodIndex, 1, this.selectedGoods);
    }
    this.isShowSaveGoodsDialog = false;
    this.showDisabled = true;
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
  mdBatchNumList = [];
  // 选择批次
  onBatchNumChange(e) {
    this.mdBatchNumList = [];
    // 选择批次号的时候带出来相关批次
    this.httpReq.post(
      "/med_drug/listMdBatchNumByBn",
      null,
      {
        batchNum: this.selectedGoods.batchNum,
        medDrugsId: this.selectedGoods.medDrugsId
      },
      data => {
        if (data["code"] == 0) {
          const result = JSON.parse(data["data"]);
          this.mdBatchNumList = result;
          // this.selectedGoods.inDate=result.inDate
          // this.selectedGoods.quantity=result.quantity
          // this.selectedGoods.supplier=result.supplier
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
  // 选择批号 带出相关信息
  onMdBatchNumChange() {
    this.httpReq.post(
      "/med_drug/listByMdBatchNum",
      null,
      {
        batchNum: this.selectedGoods.batchNum,
        medDrugsId: this.selectedGoods.medDrugsId,
        mdBatchNum: this.selectedGoods.mdBatchNum
      },
      data => {
        if (data["code"] == 0) {
          const result = data["data"][0];
          this.selectedGoods.inDate = result.inDate;
          this.selectedGoods.quantity = result.quantity;
          this.selectedGoods.supplier = result.supplier;
        } else {
          this.message.error(data.message);
        }
      }
    );
  }
}
