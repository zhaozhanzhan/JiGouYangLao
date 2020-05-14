import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StorehouseClassificationComponent } from "./storehouse-classification/storehouse-classification.component";
import { StorehouseComponent } from "./storehouse/storehouse.component";
import { GoodsClassificationComponent } from "./goods-classification/goods-classification.component";
import { GoodsComponent } from "./goods/goods.component";
import { InStorehouseComponent } from "./in-storehouse/in-storehouse.component";
import { StorehouseClassificationAddEditComponent } from "./storehouse-classification/storehouse-classification-add-edit/storehouse-classification-add-edit.component";
import { StorehouseAddEditComponent } from "./storehouse/storehouse-add-edit/storehouse-add-edit.component";
import { GoodsAddEditComponent } from "./goods/goods-add-edit/goods-add-edit.component";
import { GoodsStockComponent } from "./goods/goods-stock/goods-stock.component";
import { InStorehouseAddComponent } from "./in-storehouse/in-storehouse-add/in-storehouse-add.component";
import { InStorehouseCheckComponent } from "./in-storehouse/in-storehouse-check/in-storehouse-check.component";
import { StockManagerComponent } from "./stockManager/stockManager.component";
import { MonthlyReportComponent } from "./monthlyReport/monthlyReport.component";
import { ReceiveComponent } from "./receive/receive.component";
import { ReceiveAddComponent } from "./receive/receive-add/receive-add.component";
import { ReceiveCheckComponent } from "./receive/receive-check/receive-check.component";
import { GiveoutComponent } from "./giveout/giveout.component";
import { GiveoutAddComponent } from "./giveout/giveout-add/giveout-add.component";
import { GiveoutCheckComponent } from "./giveout/giveout-check/giveout-check.component";
import { ItemOutComponent } from "./itemOut/itemOut.component";
import { CheckRecordCheckComponent } from "./itemOut/check/checkrecord-check.component";
import { CheckOutComponent } from "./itemOut/checkOut/checkOut.component";

const routes: Routes = [
  {
    path: "storehouseClassify",
    component: StorehouseClassificationComponent
  },
  {
    path: "storehouseClassify/addEdit",
    component: StorehouseClassificationAddEditComponent
  },
  {
    path: "storehouse",
    component: StorehouseComponent
  },
  {
    path: "storehouse/addEdit",
    component: StorehouseAddEditComponent
  },
  {
    path: "goodsClassify",
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
    path: "receive",
    component: ReceiveComponent
  },
  {
    path: "receive/add",
    component: ReceiveAddComponent
  },
  {
    path: "receive/check",
    component: ReceiveCheckComponent
  },
  {
    path: "giveout",
    component: GiveoutComponent
  },
  {
    path: "giveout/add",
    component: GiveoutAddComponent
  },
  {
    path: "giveout/check",
    component: GiveoutCheckComponent
  },
  {
    path: "stockManager",
    component: StockManagerComponent
  },
  {
    path: "monthlyReport",
    component: MonthlyReportComponent
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
export class DonateRoutingModule {}
