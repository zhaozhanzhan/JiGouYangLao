import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NursingOrderComponent } from "./nursingOrder.component";
const routes: Routes = [
  {
    path: "",
    component: NursingOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NursingOrderRoutingModule {}
