import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MedicalScoreComponent } from "./medicalScore.component";
const routes: Routes = [
  {
    path: "",
    component: MedicalScoreComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalScoreRoutingModule {}
