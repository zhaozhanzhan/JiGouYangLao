import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { infoDetailsComponent } from "./infoDetails/infoDetails.component";
const routes: Routes = [
  {
    path: "",
    component: ListComponent
  },
  {
    path: "info/:id",
    component: InfoComponent
  },
  {
    path: "infoDetails/:infoDetails",
    component: infoDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class fireInspectionAssessmentRoutingModule {}
