import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { PharmacyManagementRoutingModule } from "./pharmacyManagement-routing.module";
import { PharmaceuticalAdministrationComponent } from "./pharmaceuticalAdministration/pharmaceuticalAdministration.component";
import { PharmaceuticalAdministrationAddEditComponent } from "./pharmaceuticalAdministration/pharmaceuticalAdministration-add-edit/pharmaceuticalAdministration-add-edit.component";
import { InStorehouseAddComponent } from "./in-storehouse/in-storehouse-add/in-storehouse-add.component";
import { InStorehouseComponent } from "./in-storehouse/in-storehouse.component";
import { InStorehouseCheckComponent } from "./in-storehouse/in-storehouse-check/in-storehouse-check.component";
import { InStorehouseList1Component } from "./in-storehouse/in-storehouse-list1/in-storehouse-list1.component";
import { InStorehouseList2Component } from "./in-storehouse/in-storehouse-list2/in-storehouse-list2.component";
import { OutStorehouseComponent } from "./out-storehouse/out-storehouse.component";
import { OutStorehouseAddComponent } from "./out-storehouse/out-storehouse-add/out-storehouse-add.component";
import { OutStorehouseCheckComponent } from "./out-storehouse/out-storehouse-check/out-storehouse-check.component";
import { OutStorehouseList2Component } from "./out-storehouse/out-storehouse-list2/out-storehouse-list2.component";
import { OutStorehouseList1Component } from "./out-storehouse/out-storehouse-list1/out-storehouse-list1.component";
import { IODetailComponent } from "./ioDetail/ioDetail.component";
import { OverdueDamageComponent } from "./overdueDamage/overdueDamage.component";
import { OverdueDamageAddEditComponent } from "./overdueDamage/overdueDamage-add-edit/overdueDamage-add-edit.component";
import { OverdueDamageCheckComponent } from "./overdueDamage/overdueDamage-check/overdueDamage-check.component";
import { PharmaceuticalAdministrationCheckComponent } from "./pharmaceuticalAdministration/pharmaceuticalAdministration-check/pharmaceuticalAdministration-check.component";
import { RefundMedicineComponent } from "./ioDetail/refundMedicine/refundMedicine.component";
import { OverdueDamageApproveComponent } from "./overdueDamage/overdueDamage-approve/overdueDamage-approve.component";
import { OverdueDamageApproveCheckComponent } from "./overdueDamage/overdueDamage-approve-check/overdueDamage-approve-check.component";
import { StockComponent } from "./ioDetail/stock/stock.component";
import { RefundMedicineDetailComponent } from "./refundMedicineDetail/refundMedicineDetail.component";
import { OverdueDamageAddComponent } from "./ioDetail/overdueDamage-add-edit/overdueDamage-add-edit.component";
import { DosageFormPipe } from "./dosageForm.Pipe";
import { MedicPurchApplyModule } from "./medic-purch-apply/medic-purch-apply.module";
import { MedicPurchApproModule } from "./medic-purch-appro/medic-purch-appro.module";

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    PharmacyManagementRoutingModule,
    MedicPurchApproModule,
    MedicPurchApplyModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [
    DosageFormPipe,
    PharmaceuticalAdministrationComponent,
    PharmaceuticalAdministrationAddEditComponent,
    InStorehouseAddComponent,
    InStorehouseComponent,
    InStorehouseCheckComponent,
    InStorehouseList2Component,
    InStorehouseList1Component,
    OutStorehouseComponent,
    OutStorehouseAddComponent,
    OutStorehouseCheckComponent,
    OutStorehouseList1Component,
    OutStorehouseList2Component,
    IODetailComponent,
    OverdueDamageComponent,
    OverdueDamageAddEditComponent,
    OverdueDamageCheckComponent,
    PharmaceuticalAdministrationCheckComponent,
    RefundMedicineComponent,
    OverdueDamageApproveComponent,
    OverdueDamageApproveCheckComponent,
    StockComponent,
    RefundMedicineDetailComponent,
    OverdueDamageAddComponent
  ],
  entryComponents: [
    PharmaceuticalAdministrationComponent,
    PharmaceuticalAdministrationAddEditComponent,
    InStorehouseAddComponent,
    InStorehouseComponent,
    InStorehouseCheckComponent,
    InStorehouseList2Component,
    InStorehouseList1Component,
    OutStorehouseComponent,
    OutStorehouseAddComponent,
    OutStorehouseCheckComponent,
    OutStorehouseList1Component,
    OutStorehouseList2Component,
    IODetailComponent,
    OverdueDamageComponent,
    OverdueDamageAddEditComponent,
    OverdueDamageCheckComponent,
    PharmaceuticalAdministrationCheckComponent,
    RefundMedicineComponent,
    OverdueDamageApproveComponent,
    OverdueDamageApproveCheckComponent,
    StockComponent,
    RefundMedicineDetailComponent,
    OverdueDamageAddComponent
  ]
})
export class PharmacyManagementModule {}
