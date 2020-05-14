import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddComponent } from "./add/add.component";
import { AddDisabledComponent } from "./addDisabled/addDisabled.component";
import { CheckComponent } from "./check/check.component";
import { TumbleComponent } from "./tumble/tumble.component";
import { TumbleDisabledComponent } from "./tumbleDisabled/tumbleDisabled.component";
import { CheckDisabledComponent } from "./checkDisabled/checkDisabled.component";
import { AdmissionassessmentJNComponent } from "./admission-assessment-JN.component";
const routes: Routes = [
  {
    path: "",
    component: AdmissionassessmentJNComponent
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
export class AdmissionassessmentJNRoutingModule {}
