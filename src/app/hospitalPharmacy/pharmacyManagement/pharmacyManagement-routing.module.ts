import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PharmaceuticalAdministrationComponent } from "./pharmaceuticalAdministration/pharmaceuticalAdministration.component";
import { PharmaceuticalAdministrationAddEditComponent } from "./pharmaceuticalAdministration/pharmaceuticalAdministration-add-edit/pharmaceuticalAdministration-add-edit.component";
import { InStorehouseComponent } from "./in-storehouse/in-storehouse.component";
import { InStorehouseAddComponent } from "./in-storehouse/in-storehouse-add/in-storehouse-add.component";
import { InStorehouseCheckComponent } from "./in-storehouse/in-storehouse-check/in-storehouse-check.component";
import { OutStorehouseComponent } from "./out-storehouse/out-storehouse.component";
import { OutStorehouseAddComponent } from "./out-storehouse/out-storehouse-add/out-storehouse-add.component";
import { OutStorehouseCheckComponent } from "./out-storehouse/out-storehouse-check/out-storehouse-check.component";
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

const routes: Routes = [
  {
    path: "pharmaceuticalAdmin",
    component: PharmaceuticalAdministrationComponent
  },
  {
    path: "pharmaceuticalAdmin/addEdit",
    component: PharmaceuticalAdministrationAddEditComponent
  },
  {
    path: "pharmaceuticalAdmin/check",
    component: PharmaceuticalAdministrationCheckComponent
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
    path: "ioDetail",
    component: IODetailComponent
  },
  {
    path: "ioDetail/refundMedicine",
    component: RefundMedicineComponent
  },
  {
    path: "ioDetail/stock",
    component: StockComponent
  },
  {
    path: "ioDetail/Overdue",
    component: OverdueDamageAddComponent
  },
  {
    path: "overdueDamage",
    component: OverdueDamageComponent
  },
  {
    path: "overdueDamage/addEdit",
    component: OverdueDamageAddEditComponent
  },
  {
    path: "overdueDamage/check",
    component: OverdueDamageCheckComponent
  },
  {
    path: "overdueDamage/approve",
    component: OverdueDamageApproveComponent
  },
  {
    path: "overdueDamage/approveCheck",
    component: OverdueDamageApproveCheckComponent
  },
  {
    path: "refundDetail",
    component: RefundMedicineDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyManagementRoutingModule {}
