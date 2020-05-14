import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { InfoInterviewManagerComponent } from "./list/info-interview-manager.component";

const routes: Routes = [
  {
    path: "",
    component: InfoInterviewManagerComponent
  },
  {
    path: "save",
    component: AddComponent
  },
  {
    path: "check/:id",
    component: CheckComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoInterviewRoutingModule {}
