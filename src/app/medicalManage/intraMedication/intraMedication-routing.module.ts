import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IntraMedicationComponent } from "./intraMedication.component";
const routes: Routes = [
  {
    path: "",
    component: IntraMedicationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntraMedicationRoutingModule {}
