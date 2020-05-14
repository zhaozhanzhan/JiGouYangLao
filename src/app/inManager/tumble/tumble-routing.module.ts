import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { CheckComponent } from "./check/check.component";
const routes: Routes = [
  {
    path: "",
    component: ListComponent
  },
  {
    path: "info/:info",
    component: InfoComponent
  },
  {
    path: "check/:info",
    component: CheckComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TumbleAssessmentRoutingModule {}
