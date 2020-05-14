import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GuideFlowComponent } from "./guideFlow.component";

const routes: Routes = [
  {
    path: "",
    component: GuideFlowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuideFlowRoutingModule {}
