import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StorehouseComponent } from "./storehouse/storehouse.component";
import { GoodsClassificationComponent } from "./goods-classification/goods-classification.component";
import { GoodsComponent } from "./goods/goods.component";
import { InStorehouseComponent } from "./in-storehouse/in-storehouse.component";
import { OutStorehouseComponent } from "./out-storehouse/out-storehouse.component";
import { StorehouseAddEditComponent } from "./storehouse/storehouse-add-edit/storehouse-add-edit.component";
import { GoodsAddEditComponent } from "./goods/goods-add-edit/goods-add-edit.component";
import { GoodsStockComponent } from "./goods/goods-stock/goods-stock.component";
import { InStorehouseAddComponent } from "./in-storehouse/in-storehouse-add/in-storehouse-add.component";
import { OutStorehouseAddComponent } from "./out-storehouse/out-storehouse-add/out-storehouse-add.component";
import { InStorehouseCheckComponent } from "./in-storehouse/in-storehouse-check/in-storehouse-check.component";
import { OutStorehouseCheckComponent } from "./out-storehouse/out-storehouse-check/out-storehouse-check.component";
import { PurchaseRequestComponent } from "./purchaseRequest/purchaseRequest.component";
import { PurchaseSuppliesComponent } from "./purchaseSupplies/purchaseSupplies.component";
import { StockManagerComponent } from "./stockManager/stockManager.component";
import { IODetailComponent } from "./ioDetail/ioDetail.component";
import { AddPurchaseRequestComponent } from "./purchaseRequest/addPurchaseRequest/addPurchaseRequest.component";
import { PurchaseApproveComponent } from "./purchaseApprove/purchaseApprove.component";
import { ApprovePurchaseComponent } from "./purchaseApprove/approve/approve.component";
import { RequestInStorehouseComponent } from "./purchaseRequest/inStorehouse/inStorehouse.component";
import { ShowForAfterInComponent } from "./purchaseRequest/showForAfterIn/showForAfterIn.component";
import { ReleaseRecordComponent } from "./releaseRecord/releaseRecord.component";
import { MonthlyDistributionComponent } from "./monthlyDistribution/monthlyDistribution.component";
import { ReleaseRecordAddEditComponent } from "./releaseRecord/storehouse-add-edit/storehouse-add-edit.component";
import { ItemOutComponent } from "./itemOut/itemOut.component";
import { CheckRecordCheckComponent } from "./itemOut/check/checkrecord-check.component";
import { CheckOutComponent } from "./itemOut/checkOut/checkOut.component";

const routes: Routes = [
  {
    path: "storehouse",
    component: StorehouseComponent
  },
  {
    path: "storehouse/addEdit",
    component: StorehouseAddEditComponent
  },
  {
    path: "goodsClassification",
    component: GoodsClassificationComponent
  },
  {
    path: "goods",
    component: GoodsComponent
  },
  {
    path: "goods/addEdit",
    component: GoodsAddEditComponent
  },
  {
    path: "goods/stock",
    component: GoodsStockComponent
  },
  {
    path: "inStorehouse",
    component: InStorehouseComponent
  },
  {
    path: "inStorehouse/add",
    component: InStorehouseAddComponent
  },
  {
    path: "inStorehouse/check",
    component: InStorehouseCheckComponent
  },
  {
    path: "outStorehouse",
    component: OutStorehouseComponent
  },
  {
    path: "outStorehouse/add",
    component: OutStorehouseAddComponent
  },
  {
    path: "outStorehouse/check",
    component: OutStorehouseCheckComponent
  },
  {
    path: "purchaseRequest",
    component: PurchaseRequestComponent
  },
  {
    path: "purchaseRequest/addEdit",
    component: AddPurchaseRequestComponent
  },
  {
    path: "purchaseRequest/inStorehouse",
    component: RequestInStorehouseComponent
  },
  {
    path: "purchaseRequest/showForAfterIn",
    component: ShowForAfterInComponent
  },
  {
    path: "purchaseApprove",
    component: PurchaseApproveComponent
  },
  {
    path: "purchaseApprove/approve",
    component: ApprovePurchaseComponent
  },
  {
    path: "purchaseSupplies",
    component: PurchaseSuppliesComponent
  },
  {
    path: "stockManager",
    component: StockManagerComponent
  },
  {
    path: "ioDetail",
    component: IODetailComponent
  },
  {
    path: "releaseRecord",
    component: ReleaseRecordComponent
  },
  {
    path: "monthlyDistribution",
    component: MonthlyDistributionComponent
  },
  {
    path: "releaseRecord/addEdit",
    component: ReleaseRecordAddEditComponent
  },
  {
    path: "itemOut",
    component: ItemOutComponent
  },
  {
    path: "itemOut/check",
    component: CheckRecordCheckComponent
  },
  {
    path: "itemOut/checkOut",
    component: CheckOutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule {}
