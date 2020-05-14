import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StandingOrderComponent } from "./standingOrder.component";
const routes: Routes = [
  {
    path: "",
    component: StandingOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandingOrderRoutingModule {}
