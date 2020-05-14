import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChartDrawComponent } from "./chartDraw/chartDraw.component";
const routes: Routes = [
  {
    path: "",
    component: ChartDrawComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementRoutingDrawModule {}
