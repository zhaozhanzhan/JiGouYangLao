import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DiabetesOrderComponent } from "./diabetesOrder.component";
const routes: Routes = [
  {
    path: "",
    component: DiabetesOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiabetesOrderRoutingModule {}
