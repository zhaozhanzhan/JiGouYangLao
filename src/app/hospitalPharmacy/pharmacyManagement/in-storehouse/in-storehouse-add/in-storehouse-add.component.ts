/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-27 16:06:46
 * @Description:
 */
import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";
import { LocalStorage } from "../../../../common/service/local.storage";
import { EventManager } from "@angular/platform-browser";

@Component({
  selector: "app-in-storehouse-add",
  templateUrl: "./in-storehouse-add.component.html",
  styleUrls: ["./in-storehouse-add.component.css"]
})
export class InStorehouseAddComponent implements OnInit {
  formatterDollar = value => `￥ ${value}`;
  parserDollar = value => value.replace("￥ ", "");
  selectedGoods = {
    inMedDrugsId: "", //入库药品id
    inMedDrugsName: "", //药品名称
    autoNum: 1, //自动编号（不可修改
    inNum: 1, //入库数量
    purchasePrice: "", //采购单价
    productionDate: "", //生产日期
    validityDate: "",//有效期
    shelfLife: "", //保质期
    comment: "", //入库物品备注
    specificationsModels: "", //规格型号
    manufacturer: "", //生产厂商
    supplier: "", //供应商
    mdBatchNum: "" //药品批号
  };
  //用于传递当前编辑的物品的下标位，-1为添加模式
  modifyGoodIndex = -1;
  //是否显示编辑物品对话框状态
  isShowSaveGoodsDialog = false;
  userInfo;
  validateForm;

  //物品列表
  goodsList = [];

  //添加的入库物品列表
  inGoodsList = [];

  isBtnLoading = false;

  //药房列表
  medRoomList = [];
  constructor(
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private localStroage: LocalStorage,
    private jsUtils: JsUtilsService,
    private eventManager: EventManager
  ) {

    this.goodsList = [];
  }

  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.validateForm = this.fb.group({
      inDate: [new Date(), [Validators.required]], //入库时间
      operator: ["", [Validators.required]], //操作人
      inComment: ["", []], //入库备注
      accountId: [this.userInfo.id, []], //账户Id
      sectionOfficeOutId: ["", []]
    });

    this.validateForm.patchValue({
      operator: this.userInfo.name
    });
    // 获得所有得药品得名称
    this.httpReq.post("med_drug/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });

    // 获得所有得科室
    this.httpReq.post("/section_office/listAllOut", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.medRoomList =
          data.data instanceof Array
            ? data.data
            : [{ medRoomName: "暂无药房", id: "" }];
      }
    });

    this.eventManager.addGlobalEventListener('window', 'keydown', (event: any) => {
      if (event.key === "Enter") {
        if (this.isShowSaveGoodsDialog) {
          this.doDialogSave();
        }
      }
    })
  }

  back() {
    history.back();
  }

  // 选择药品
  onGoodsChange(value: string): void {
    this.goodsList.forEach(element => {
      if (element.id == value) {
        if (Utils.isNotEmpty(element.specification)) {
          this.selectedGoods.specificationsModels = element.specification;
        }
        if (Utils.isNotEmpty(element.manufacturers)) {
          this.selectedGoods.manufacturer = element.manufacturers;
        }
        if (Utils.isNotEmpty(element.drugName)) {
          this.selectedGoods.inMedDrugsName = element.drugName;
        }
      }
    });
  }

  //保存入库信息
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
      element.validityDate = this.jsUtils.dateFormat(element.validityDate);
    });
    let reqObj = this.validateForm.value;
    reqObj.accountId = this.userInfo.id;
    reqObj.inMedDrugInfo = this.inGoodsList;
    reqObj.inDate = this.jsUtils.dateFormat(
      reqObj.inDate,
      "YYYY-MM-DD HH:mm:ss"
    );

    reqObj.isOut = false;
    if (reqObj.sectionOfficeOutId.length > 0) {
      reqObj.isOut = true;
    }

    this.isBtnLoading = true;
    this.httpReq.post("in_med_drug/saveOrUpdate", null, reqObj, data => {
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
      inMedDrugsId: "", //入库药品id
      inMedDrugsName: "", //药品名称
      autoNum: 1, //自动编号（不可修改
      inNum: 1, //入库数量
      purchasePrice: "", //采购单价
      productionDate: "", //生产日期
      validityDate: "",//有效期
      shelfLife: "", //保质期
      comment: "", //入库物品备注
      specificationsModels: "", //规格型号
      manufacturer: "", //生产厂商
      supplier: "", //供应商
      mdBatchNum: "" //药品批号
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
    if (Utils.isEmpty(this.selectedGoods.inMedDrugsId)) {
      this.message.error("请选择需要入库的药品！");
      return;
    }
    if (Utils.isEmpty(this.selectedGoods.mdBatchNum)) {
      this.message.error("请输入药品批号！");
      return;
    }

    if (Utils.isEmpty(this.selectedGoods.validityDate)) {
      this.message.error("请输入有效期！");
      return;
    }

    if (
      Utils.isEmpty(this.selectedGoods.inNum) ||
      this.selectedGoods.inNum <= 0
    ) {
      this.message.error("请选择输入入库药品数量！");
      return;
    }
    if (this.modifyGoodIndex == -1) {
      this.inGoodsList.push(this.selectedGoods);
    } else {
      this.inGoodsList.splice(this.modifyGoodIndex, 1, this.selectedGoods);
    }
    this.isShowSaveGoodsDialog = false;
    this.showSaveGoodsDialog(null, -1);
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
