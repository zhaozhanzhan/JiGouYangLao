import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";

class Inventory {
  warehouseId: string;
  departmentName: "";
  warehouseCategoryName: "";
  quantity: number;
  whComment: "";
}

@Component({
  selector: "app-goods-stock",
  templateUrl: "./goods-stock.component.html",
  styleUrls: ["./goods-stock.component.css"]
})
export class GoodsStockComponent implements OnInit {
  isLoading = false;

  goodsRepertoryInfo = {
    unit: "",
    goodName: "",
    inventoryInfo: [],
    goodCategory: "",
    model: "",
    comment: ""
  };

  constructor(private route: ActivatedRoute, private httpReq: HttpReqService) {}
  ngOnInit() {
    const goodId = this.route.snapshot.paramMap.get("goodId");
    let that = this;
    this.isLoading = true;
    this.httpReq.post("goods/listGoodDetail", null, { id: goodId }, data => {
      that.isLoading = false;
      if (data["code"] == 0) {
        let goodsListTemp = JSON.parse(data["data"]);
        console.log("tag", goodsListTemp);
        that.goodsRepertoryInfo = goodsListTemp;
      }
    });
  }

  back() {
    history.back();
  }
}
