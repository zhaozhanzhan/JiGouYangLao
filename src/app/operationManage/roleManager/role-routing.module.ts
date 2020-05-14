import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RoleManagerComponent } from "./role.component";

const routes: Routes = [
  {
    path: "",
    component: RoleManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagerRoutingModule {}
