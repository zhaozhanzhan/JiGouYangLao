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
    inDate: "",
    inComment: "",
    inWhName: "",
    donatedCompany: "",
    donatedDate: "",
    useFor: "",
    recorder: "",
    desc: [],
    useDepartment:""
  };
  inGoodsList = [];
  selectedGoods = {
    singlePrice: 0,
    requisitionDate: "",
    productionDate: "",
    goodsComment: "",
    name: "",
    batchNum: "",
    expireDate: "",
    inNum: 0,
    shelfLife: "",
    inMoney: 0,
  };
  departmentList=[];
  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {}

  ngOnInit() {
    const inRecordId = this.route.snapshot.paramMap.get("inRecordId");
    let that = this;
    this.isLoading = true;
    this.httpReq.post(
      "inDonatedWarehouse/listGoodsDetail",
      null,
      { inDonatedWarehouseId: inRecordId },
      data => {
        that.isLoading = false;
        if (data["code"] == 0) {
          that.inStorehouse = JSON.parse(data["data"]);
          that.inGoodsList = that.inStorehouse.desc;
        }
      }
    );

    this.httpReq.post("department/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.departmentList = data["data"];
      }
    });
  }

  back() {
    history.back();
  }

  showSaveGoodsDialog(goodsInfo) {
    if (goodsInfo) {
      this.selectedGoods = goodsInfo;
      this.isShowSaveGoodsDialog = true;
    }
  }
}
