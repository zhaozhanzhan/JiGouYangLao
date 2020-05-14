import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NursingAppConfigComponent } from "./nursingAppConfig.component";

const routes: Routes = [
  {
    path: "",
    component: NursingAppConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NursingAppConfigRoutingModule {}
