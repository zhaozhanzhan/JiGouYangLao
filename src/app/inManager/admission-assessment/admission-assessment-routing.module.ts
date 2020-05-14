import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddComponent } from "./add/add.component";
import { AddDisabledComponent } from "./addDisabled/addDisabled.component";
import { CheckComponent } from "./check/check.component";
import { TumbleComponent } from "./tumble/tumble.component";
import { TumbleDisabledComponent } from "./tumbleDisabled/tumbleDisabled.component";
import { CheckDisabledComponent } from "./checkDisabled/checkDisabled.component";
import { AdmissionassessmentComponent } from "./admission-assessment.component";
const routes: Routes = [
  {
    path: "",
    component: AdmissionassessmentComponent
  },
  {
    path: "add/:id",
    component: AddComponent
  },
  {
    path: "addDisabled/:id",
    component: AddDisabledComponent
  },
  {
    path: "check/:id",
    component: CheckComponent
  },
  {
    path: "checkDisabled/:id",
    component: CheckDisabledComponent
  },
  {
    path: "tumble/:id",
    component: TumbleComponent
  },
  {
    path: "tumbleDisabled/:id",
    component: TumbleDisabledComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionassessmentRoutingModule {}
