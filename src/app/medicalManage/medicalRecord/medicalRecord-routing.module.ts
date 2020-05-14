import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MedicalRecordComponent } from "./medicalRecord.component";
const routes: Routes = [
  {
    path: "",
    component: MedicalRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRecordRoutingModule {}
