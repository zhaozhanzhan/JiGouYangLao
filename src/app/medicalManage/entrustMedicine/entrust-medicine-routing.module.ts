import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DetailTrustComponent } from "./entrust-medicine/detail-trust/detail-trust.component";
import { TakeMedicineRecordComponent } from "./take-medicine-record/take-medicine-record.component";
import { SendMedicineRecordComponent } from "./send-medicine-record/send-medicine-record.component";
import { EntrustMedicineComponent } from "./entrust-medicine/entrust-medicine.component";
const routes: Routes = [
  {
    path: "EntrustMedicine",
    component: EntrustMedicineComponent
  },
  {
    path: "DetailTrust",
    component: DetailTrustComponent
  },
  {
    path: "TakeMedicineRecord",
    component: TakeMedicineRecordComponent
  },
  {
    path: "SendMedicineRecord",
    component: SendMedicineRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrustMedicineRoutingModule {}
