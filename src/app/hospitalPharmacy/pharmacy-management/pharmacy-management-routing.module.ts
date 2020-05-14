import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DisplayAndSendMedicienComponent } from "./display-and-send-medicien/display-and-send-medicien.component";
import { SummarizatMedicineComponent } from "./summarizat-medicine/summarizat-medicine.component";
import { InHospitolReturnMedicineComponent } from "./in-hospitol-return-medicine/in-hospitol-return-medicine.component";
import { PharmactConfigComponent } from "./pharmact-config/pharmact-config.component";
import { AddPharmacyComponent } from "./pharmact-config/add-pharmacy/add-pharmacy.component";

import { PharmacyDetailComponent } from "./pharmacy-detail/pharmacy-detail.component";
import { SendMedListComponent } from "./send-med-list/send-med-list.component";
import { InMedListComponent } from "./in-med-list/in-med-list.component";
import { PartiDefListComponent } from "./parti-def-list/parti-def-list.component";
import { SplitDrugListComponent } from "./split-drug-list/split-drug-list.component";
const routes: Routes = [
  {
    path: "DisplayAndSendMedicienComponent",
    component: DisplayAndSendMedicienComponent
  },
  {
    path: "SummarizatMedicine",
    component: SummarizatMedicineComponent
  },
  {
    path: "InHospitolReturnMedicine",
    component: InHospitolReturnMedicineComponent
  },
  {
    path: "PharmactConfig",
    component: PharmactConfigComponent
  },
  {
    path: "add",
    component: AddPharmacyComponent
  },
  {
    path: "PharmacyDetail",
    component: PharmacyDetailComponent
  },
  {
    path: "SendMedList",
    component: SendMedListComponent
  },
  {
    path: "InMedList",
    component: InMedListComponent
  },
  {
    path: "partiDefList",
    component: PartiDefListComponent
  },
  {
    path: "splitDrugList",
    component: SplitDrugListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyManagementRoutingModule {}
