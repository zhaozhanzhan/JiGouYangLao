import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";

@Component({
  selector: "app-in-storehouse-check",
  templateUrl: "./in-storehouse-check.component.html",
  styleUrls: ["./in-storehouse-check.component.css"]
})
export class InStorehouseCheckComponent implements OnInit {
  isLoading = false;
  isShowSaveGoodsDialog = false;

  inStorehouse = {
    inId: "",
    inDate: "", //入库日期
    inComment: "", //备注
    inWhName: "", //
    inSource: "", //
    operator: "", //操作人
    desc: [] //
  };
  inGoodsList = []; //药品的数组
  selectedGoods = {
    drugName: "", //药品名称
    purchasePrice: "", //采购单价
    inNum: 0, ///数量
    specification: "", //药品规格
    manufacturers: "", //生产厂商
    productionDate: "", //生产日期
    validityDate: "", //有效期
    shelfLife: "", //保质期(天)
    mdBatchNum: "", //药品批号
    supplier: "", //供应商
    comment: "" //备注
  };
  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {}

  ngOnInit() {
    const inRecordId = this.route.snapshot.paramMap.get("inRecordId");
    let that = this;
    this.isLoading = true;
    this.httpReq.post(
      "/in_med_drug/listDetail",
      null,
      { inMedDrugId: inRecordId },
      data => {
        that.isLoading = false;
        if (data["code"] == 0) {
          that.inStorehouse = data["data"];
          that.inGoodsList = data["data"]["inMedDrugs"];
        }
      }
    );
  }

  //返回
  back() {
    history.back();
  }

  //查看数据
  showSaveGoodsDialog(goodsInfo) {
    if (goodsInfo) {
      this.selectedGoods = goodsInfo.medDrug;
      this.selectedGoods.inNum = goodsInfo.inNum;
      this.selectedGoods.productionDate = goodsInfo.productionDate;
      this.selectedGoods.validityDate = goodsInfo.validityDate;
      this.selectedGoods.shelfLife = goodsInfo.shelfLife;
      this.selectedGoods.purchasePrice = goodsInfo.purchasePrice;
      this.selectedGoods.mdBatchNum = goodsInfo.mdBatchNum;
      this.selectedGoods.supplier = goodsInfo.supplier;
      this.selectedGoods.comment = goodsInfo.comment;
      this.isShowSaveGoodsDialog = true;
    }
  }
}
