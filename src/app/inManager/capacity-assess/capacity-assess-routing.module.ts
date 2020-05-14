import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CapacityListComponent } from "./capacity-list/capacity-list.component";
import { CapacityAddComponent } from "./capacity-add/capacity-add.component";
import { CapacityDisabledComponent } from "./capacity-disabled/capacity-disabled.component";

const routes: Routes = [
  {
    path: "",
    component: CapacityListComponent
  },
  {
    path: "add",
    component: CapacityAddComponent
  },
  {
    path: "check",
    component: CapacityDisabledComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacityAssessRoutingModule {}
