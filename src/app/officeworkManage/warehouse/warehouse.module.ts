import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { WarehouseRoutingModule } from "./warehouse-routing.module";
import { StorehouseComponent } from "./storehouse/storehouse.component";
import { GoodsComponent } from "./goods/goods.component";
import { GoodsClassificationComponent } from "./goods-classification/goods-classification.component";
import { InStorehouseComponent } from "./in-storehouse/in-storehouse.component";
import { OutStorehouseComponent } from "./out-storehouse/out-storehouse.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { StorehouseAddEditComponent } from "./storehouse/storehouse-add-edit/storehouse-add-edit.component";
import { GoodsAddEditComponent } from "./goods/goods-add-edit/goods-add-edit.component";
import { GoodsStockComponent } from "./goods/goods-stock/goods-stock.component";
import { InStorehouseAddComponent } from "./in-storehouse/in-storehouse-add/in-storehouse-add.component";
import { OutStorehouseAddComponent } from "./out-storehouse/out-storehouse-add/out-storehouse-add.component";
import { InStorehouseCheckComponent } from "./in-storehouse/in-storehouse-check/in-storehouse-check.component";
import { OutStorehouseCheckComponent } from "./out-storehouse/out-storehouse-check/out-storehouse-check.component";
import { OutStorehouseList1Component } from "./out-storehouse/out-storehouse-list1/out-storehouse-list1.component";
import { OutStorehouseList2Component } from "./out-storehouse/out-storehouse-list2/out-storehouse-list2.component";
import { InStorehouseList1Component } from "./in-storehouse/in-storehouse-list1/in-storehouse-list1.component";
import { InStorehouseList2Component } from "./in-storehouse/in-storehouse-list2/in-storehouse-list2.component";
import { PurchaseRequestComponent } from "./purchaseRequest/purchaseRequest.component";
import { PurchaseSuppliesComponent } from "./purchaseSupplies/purchaseSupplies.component";
import { StockManagerComponent } from "./stockManager/stockManager.component";
import { IODetailComponent } from "./ioDetail/ioDetail.component";
import { AddPurchaseRequestComponent } from "./purchaseRequest/addPurchaseRequest/addPurchaseRequest.component";
import { ENgxPrintModule } from "e-ngx-print";
import { ApprovePurchaseComponent } from "./purchaseApprove/approve/approve.component";
import { PurchaseApproveComponent } from "./purchaseApprove/purchaseApprove.component";
import { RequestInStorehouseComponent } from "./purchaseRequest/inStorehouse/inStorehouse.component";
import { ShowForAfterInComponent } from "./purchaseRequest/showForAfterIn/showForAfterIn.component";
import { ReleaseRecordComponent } from "./releaseRecord/releaseRecord.component";
import { MonthlyDistributionComponent } from "./monthlyDistribution/monthlyDistribution.component";
import { ReleaseRecordAddEditComponent } from "./releaseRecord/storehouse-add-edit/storehouse-add-edit.component";
import { ItemOutComponent } from "./itemOut/itemOut.component";
import { CheckOutList1Component } from "./itemOut/checkOutList1/checkOutList1.component";
import { CheckOutList2Component } from "./itemOut/checkOutList2/checkOutList2.component";
import { CheckOutComponent } from "./itemOut/checkOut/checkOut.component";
import { CheckRecordCheckComponent } from "./itemOut/check/checkrecord-check.component";

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    WarehouseRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [
    StorehouseComponent,
    GoodsComponent,
    GoodsClassificationComponent,
    InStorehouseComponent,
    OutStorehouseComponent,
    StorehouseAddEditComponent,
    GoodsAddEditComponent,
    GoodsStockComponent,
    InStorehouseAddComponent,
    InStorehouseCheckComponent,
    OutStorehouseAddComponent,
    OutStorehouseCheckComponent,
    OutStorehouseList1Component,
    OutStorehouseList2Component,
    InStorehouseList1Component,
    InStorehouseList2Component,
    PurchaseRequestComponent,
    AddPurchaseRequestComponent,
    RequestInStorehouseComponent,
    ShowForAfterInComponent,
    PurchaseApproveComponent,
    ApprovePurchaseComponent,
    PurchaseSuppliesComponent,
    StockManagerComponent,
    IODetailComponent,
    ReleaseRecordComponent,
    MonthlyDistributionComponent,
    ReleaseRecordAddEditComponent,
    ItemOutComponent,
    CheckOutList2Component,
    CheckOutList1Component,
    CheckOutComponent,
    CheckRecordCheckComponent
  ],
  entryComponents: [
    StorehouseComponent,
    GoodsComponent,
    GoodsClassificationComponent,
    InStorehouseComponent,
    OutStorehouseComponent,
    ReleaseRecordAddEditComponent
  ]
})
export class WarehouseModule {}
