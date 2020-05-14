import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, Validators } from "@angular/forms";
import { LocalStorage } from "../../../../common/service/local.storage";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { Utils } from "../../../../common/utils/utils";
import { ENgxPrintComponent } from "e-ngx-print";
@Component({
  selector: "app-addPurchaseRequest",
  templateUrl: "./addPurchaseRequest.component.html",
  styleUrls: ["./addPurchaseRequest.component.css"]
})
export class AddPurchaseRequestComponent implements OnInit {
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

  approveInfo = {
    isPass: false,
    requisitionId: "",
    applyName: "",
    approvalUrl: "",
    applyDate: ""
  };
  disabled = false;
  tagName = "";
  departmentName = "";
  wuGoodsList = [];
  month = "";
  day = "";
  SumGoodsPrice;
  @ViewChild("print") printComponent: ENgxPrintComponent;
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
    this.getLocalConfig();
    let requestId = this.route.snapshot.paramMap.get("requestId");
    if (Utils.isEmpty(requestId)) {
      requestId = "";
    }
    this.pageMode = this.route.snapshot.paramMap.get("state");
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;

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
          this.approveInfo.isPass = resultData.status == "1";
          this.approveInfo.applyName = resultData.applyName;
          this.approveInfo.applyDate = resultData.applyDate;
          this.approveInfo.approvalUrl = resultData.approvalUrl;
          this.departmentName = resultData.department.name;
          let first = resultData.createDate.split(" ")[0];

          this.month = first.split("-")[1];
          this.day = first.split("-")[2];
          console.log(
            " new Date(resultData.createDate)" + resultData.createDate
          );
          this.wuGoodsList.length = 28;
          resultData.requisitionGoods.forEach(element => {
            let tempGoodInfo = {
              createDate: element.createDate,
              rGoodsId: element.id,
              goodsId: element.rGoods.id,
              rGoodsNum: element.rGoodsNum,
              rGoodsPrice: element.rGoodsPrice,
              rGoodsUser: element.rGoodsUser,
              rGoodsComment: element.rGoodsComment,
              goodsName: element.rGoods.name,
              goodsModel: element.rGoods.model,
              goodsUnit: element.rGoods.unit,
              goodsClassification: element.rGoods.goodsCategory.name,
              SumGoodsPrice: ""
            };
            this.SumGoodsPrice =
              parseFloat(element.rGoodsNum) * parseFloat(element.rGoodsPrice);
            tempGoodInfo.SumGoodsPrice = this.SumGoodsPrice + "";
            this.inGoodsList.push(tempGoodInfo);

            this.wuGoodsList.unshift(tempGoodInfo);
          });
        }
      });
    }
  }

  back() {
    history.back();
  }
  // 打印功能
  onPrint(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.printComponent.print();
    this.disabled = true;
    // this.updateList();
  }

  printComplete() {
    this.disabled = false;
  }
  // 获得打印的标头名字
  getLocalConfig() {
    let config = JSON.parse(localStorage.getItem("serveConfig"));
    this.tagName = config.originFullName;
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

    let reqObj = this.validateForm.value;
    reqObj.createDate = this.jsUtils.dateFormat(
      reqObj.createDate,
      "YYYY-MM-DD HH:mm:ss"
    );
    reqObj.rGoods = this.inGoodsList;
    console.log(JSON.stringify(reqObj));

    this.isBtnLoading = true;
    this.httpReq.post("requisition/saveOrUpdate", null, reqObj, data => {
      this.isBtnLoading = false;
      if (data["code"] == 0) {
        this.message.success("保存成功！");
        this.back();
      }
    });
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
      if (this.inGoodsList.length > 28) {
        this.message.error("物品最多可以添加28个");
        return;
      } else {
        this.inGoodsList.push(this.selectedGoods);
      }
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
