import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { InfoInterManagerComponent } from "./list/info-inter-manager.component";

const routes: Routes = [
  {
    path: "",
    component: InfoInterManagerComponent
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
export class InfoInterRoutingModule {}
