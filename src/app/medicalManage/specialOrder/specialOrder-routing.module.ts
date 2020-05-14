import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SpecialOrderComponent } from "./specialOrder.component";
const routes: Routes = [
  {
    path: "",
    component: SpecialOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialOrderRoutingModule {}
