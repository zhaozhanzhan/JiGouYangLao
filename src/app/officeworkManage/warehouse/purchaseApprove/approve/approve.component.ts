import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";

@Component({
  selector: "app-approve",
  templateUrl: "./approve.component.html",
  styleUrls: ["./approve.component.css"]
})
export class ApprovePurchaseComponent implements OnInit {
  //当前页面显示状态
  pageMode = "";
  departmentList = [];
  formatterDollar = value => `￥ ${value}`;
  parserDollar = value => value.replace("￥ ", "");
  selectedGoods = {
    rGoodsId: "",
    goodsId: "",
    rGoodsNum: 1,
    rGoodsPrice: "",
    rGoodsUser: "",
    rGoodsComment: "",
    goodsName: "",
    goodsModel: "",
    goodsUnit: "",
    goodsClassification: ""
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

  saveApproveParam = {
    requisitionId: "",
    applyName: "",
    approvalUrl: "",
    applyDate: ""
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
    let requestId = this.route.snapshot.paramMap.get("requestId");
    if (Utils.isEmpty(requestId)) {
      requestId = "";
    }
    this.pageMode = this.route.snapshot.paramMap.get("state");
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

    this.saveApproveParam.requisitionId = requestId;
    this.saveApproveParam.applyName = this.userInfo.name;

    this.validateForm = this.fb.group({
      id: [requestId, []],
      createDate: [new Date(), [Validators.required]],
      rid: ["", []],
      deptId: ["", [Validators.required]],
      rOperator: [this.userInfo.name, [Validators.required]],
      rComment: ["", []],
      title: ["", [Validators.required]]
    });

    this.httpReq.post("department/listAll", null, {}, data => {
      if (data["code"] == 0) {
        this.departmentList = data["data"];
      }
    });

    this.httpReq.post("goods/listAll", null, {}, data => {
      if (data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });

    if (!Utils.isEmpty(requestId)) {
      let reqParam = { requisitionId: requestId };
      this.httpReq.post("requisition/listDetail", null, reqParam, data => {
        if (data["code"] == 0) {
          let resultData = data["data"];
          this.validateForm = this.fb.group({
            id: [requestId, []],
            rid: [resultData.rid, []],
            createDate: [
              new Date(resultData.createDate),
              [Validators.required]
            ],
            deptId: [resultData.department.id, [Validators.required]],
            rOperator: [resultData.rOperator, [Validators.required]],
            rComment: [resultData.rComment, []],
            title: [resultData.title, [Validators.required]]
          });
          if (this.pageMode == "info") {
            this.saveApproveParam.applyName = resultData.applyName;
            this.saveApproveParam.applyDate = resultData.applyDate;
          }
          resultData.requisitionGoods.forEach(element => {
            let tempGoodInfo = {
              rGoodsId: element.id,
              goodsId: element.rGoods.id,
              rGoodsNum: element.rGoodsNum,
              rGoodsPrice: element.rGoodsPrice,
              rGoodsUser: element.rGoodsUser,
              rGoodsComment: element.rGoodsComment,
              goodsName: element.rGoods.name,
              goodsModel: element.rGoods.model,
              goodsUnit: element.rGoods.unit,
              goodsClassification: element.rGoods.goodsCategory.name
            };
            this.inGoodsList.push(tempGoodInfo);
          });
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
        console.log(element);
        if (Utils.isNotEmpty(element.name)) {
          this.selectedGoods.goodsName = element.name;
        }
        if (Utils.isNotEmpty(element.model)) {
          this.selectedGoods.goodsModel = element.model;
        }
        if (Utils.isNotEmpty(element.unit)) {
          this.selectedGoods.goodsUnit = element.unit;
        }

        if (
          element.goodsCategory &&
          Utils.isNotEmpty(element.goodsCategory.name)
        ) {
          this.selectedGoods.goodsClassification = element.goodsCategory.name;
        }
        if (Utils.isNotEmpty(element.stdPrice)) {
          this.selectedGoods.rGoodsPrice = element.stdPrice;
        }
      }
    });
  }
  saveApprove(signImg) {
    this.saveApproveParam.approvalUrl = signImg;
    this.isBtnLoading = true;
    this.httpReq.post(
      "requisition/approveApply",
      null,
      this.saveApproveParam,
      data => {
        this.isBtnLoading = false;
        if (data["code"] == 0) {
          this.message.success("保存成功！");
          this.back();
        }
      }
    );
  }
  showSaveGoodsDialog(goodsInfo, index) {
    this.modifyGoodIndex = index;
    this.selectedGoods = {
      rGoodsId: "",
      goodsId: "",
      rGoodsNum: 1,
      rGoodsPrice: "",
      rGoodsUser: "",
      rGoodsComment: "",
      goodsName: "",
      goodsModel: "",
      goodsUnit: "",
      goodsClassification: ""
    };
    if (goodsInfo) {
      this.selectedGoods = goodsInfo;
    }

    this.isShowSaveGoodsDialog = true;
  }

  /**
   * 添加入库物品详情
   */
  doDialogSave() {
    if (Utils.isEmpty(this.selectedGoods.goodsId)) {
      this.message.error("请选择需要采购的物品！");
      return;
    }

    if (
      Utils.isEmpty(this.selectedGoods.rGoodsNum) ||
      this.selectedGoods.rGoodsNum <= 0
    ) {
      this.message.error("请选择输入采购物品数量！");
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
  }
}
