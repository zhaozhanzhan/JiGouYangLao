import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NursingOrderYGComponent } from "./nursingOrderYG.component";
const routes: Routes = [
  {
    path: "",
    component: NursingOrderYGComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NursingOrderYGRoutingModule {}
