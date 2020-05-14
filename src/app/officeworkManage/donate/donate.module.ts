import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DonateRoutingModule } from "./donate-routing.module";
import { StorehouseClassificationComponent } from "./storehouse-classification/storehouse-classification.component";
import { StorehouseComponent } from "./storehouse/storehouse.component";
import { GoodsComponent } from "./goods/goods.component";
import { GoodsClassificationComponent } from "./goods-classification/goods-classification.component";
import { InStorehouseComponent } from "./in-storehouse/in-storehouse.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { StorehouseClassificationAddEditComponent } from "./storehouse-classification/storehouse-classification-add-edit/storehouse-classification-add-edit.component";
import { StorehouseAddEditComponent } from "./storehouse/storehouse-add-edit/storehouse-add-edit.component";
import { GoodsAddEditComponent } from "./goods/goods-add-edit/goods-add-edit.component";
import { GoodsStockComponent } from "./goods/goods-stock/goods-stock.component";
import { InStorehouseAddComponent } from "./in-storehouse/in-storehouse-add/in-storehouse-add.component";
import { InStorehouseCheckComponent } from "./in-storehouse/in-storehouse-check/in-storehouse-check.component";
import { InStorehouseList1Component } from "./in-storehouse/in-storehouse-list1/in-storehouse-list1.component";
import { StockManagerComponent } from "./stockManager/stockManager.component";
import { ENgxPrintModule } from "e-ngx-print";
import { MonthlyReportComponent } from "./monthlyReport/monthlyReport.component";
import { ReceiveComponent } from "./receive/receive.component";
import { ReceiveAddComponent } from "./receive/receive-add/receive-add.component";
import { ReceiveCheckComponent } from "./receive/receive-check/receive-check.component";
import { ReceiveList1Component } from "./receive/receive-list1/receive-list1.component";
import { GiveoutComponent } from "./giveout/giveout.component";
import { GiveoutAddComponent } from "./giveout/giveout-add/giveout-add.component";
import { GiveoutCheckComponent } from "./giveout/giveout-check/giveout-check.component";
import { GiveoutList1Component } from "./giveout/giveout-list1/giveout-list1.component";
import { ItemOutComponent } from "./itemOut/itemOut.component";
import { CheckOutList1Component } from "./itemOut/checkOutList1/checkOutList1.component";
import { CheckOutList2Component } from "./itemOut/checkOutList2/checkOutList2.component";
import { CheckRecordCheckComponent } from "./itemOut/check/checkrecord-check.component";
import { CheckOutComponent } from "./itemOut/checkOut/checkOut.component";

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DonateRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [
    StorehouseClassificationComponent,
    StorehouseClassificationAddEditComponent,
    StorehouseComponent,
    GoodsComponent,
    GoodsClassificationComponent,
    InStorehouseComponent,
    StorehouseAddEditComponent,
    GoodsAddEditComponent,
    GoodsStockComponent,
    InStorehouseAddComponent,
    InStorehouseCheckComponent,
    ReceiveComponent,
    ReceiveAddComponent,
    ReceiveCheckComponent,
    ReceiveList1Component,
    GiveoutComponent,
    GiveoutAddComponent,
    GiveoutCheckComponent,
    GiveoutList1Component,
    InStorehouseList1Component,
    MonthlyReportComponent,
    StockManagerComponent,
    ItemOutComponent,
    CheckOutList1Component,
    CheckOutList2Component,
    CheckRecordCheckComponent,
    CheckOutComponent

  ],
  entryComponents: [
    StorehouseClassificationComponent,
    StorehouseClassificationAddEditComponent,
    StorehouseComponent,
    GoodsComponent,
    GoodsClassificationComponent,
    InStorehouseComponent,
    ReceiveComponent
  ]
})
export class DonateModule {}
