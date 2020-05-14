import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MedicalRecordJNComponent } from "./medicalRecordJN.component";
const routes: Routes = [
  {
    path: "",
    component: MedicalRecordJNComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRecordJNRoutingModule {}
