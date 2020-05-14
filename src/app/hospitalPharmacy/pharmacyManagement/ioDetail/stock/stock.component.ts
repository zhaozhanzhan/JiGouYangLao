import { Component, OnInit } from "@angular/core";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
class Inventory {
  warehouseId: string;
  departmentName: "";
  warehouseCategoryName: "";
  quantity: number;
  whComment: "";
}

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"]
})
export class StockComponent implements OnInit {
  isLoading = false;//加载状态

  list = [];//数据列表

  result;//参数
  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}
  ngOnInit() {
    const data = this.route.snapshot.paramMap.get("data");
    this.result = JSON.parse(data);
    let that = this;
    this.isLoading = true;
    this.httpReq.post(
      "/med_drug_inventory/listInventory",
      null,
      { id: this.result.id },
      data => {
        that.isLoading = false;
        if (data["code"] == 0) {
          let result = data["data"];
          that.list = result;
        }
      }
    );
  }

  back() {
    history.back();
  }

  // 跳转到科室退药
  turnToRefundMedicine(data) {
    this.router.navigate(
      ["../refundMedicine", { data: JSON.stringify(data) }],
      {
        relativeTo: this.route
      }
    );
  }

  root = true;
  // 跳转到过期破损
  turnToDateProcessing(dataInfo) {
    this.httpReq.post(
      "/md_overdue_damage/judgeStatus",
      null,
      { medDrugInventoryId: dataInfo.id },
      data => {
        if (data["code"] == 0) {
          this.router.navigate(
            [
              "../Overdue",
              { dataInfo: JSON.stringify(dataInfo), start: "adit" }
            ],
            {
              relativeTo: this.route
            }
          );
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 跳转到过期破损
  turnToCheckDateProcessing(dataInfo) {
    this.router.navigate(
      ["../Overdue", { dataInfo: JSON.stringify(dataInfo), start: "check" }],
      {
        relativeTo: this.route
      }
    );
  }
}
