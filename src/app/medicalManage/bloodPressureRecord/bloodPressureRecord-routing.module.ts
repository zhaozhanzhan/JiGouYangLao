import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BloodPressureRecordComponent } from "./bloodPressureRecord.component";
const routes: Routes = [
  {
    path: "",
    component: BloodPressureRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BloodPressureRecordRoutingModule {}
