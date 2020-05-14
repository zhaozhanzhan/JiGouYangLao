import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ConsultListComponent } from "./consult-list/consult-list.component";
import { ConsultAddComponent } from "./consult-add/consult-add.component";
const routes: Routes = [
  {
    path: "",
    component: ConsultListComponent
  },
  {
    path: "add",
    component: ConsultAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultManageRoutingModule {}
