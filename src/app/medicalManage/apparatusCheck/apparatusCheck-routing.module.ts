import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ApparatusCheckComponent } from "./apparatusCheck.component";
const routes: Routes = [
  {
    path: "",
    component: ApparatusCheckComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApparatusCheckRoutingModule {}
