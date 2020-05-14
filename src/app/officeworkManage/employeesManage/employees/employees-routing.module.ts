import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { EmployeesComponent } from "./list/employees.component";
import { EmployeesAddComponent } from "./add/employees-add.component";
import { LinkGroupComponent } from "./linkGroup/linkGroup.component";

const routes: Routes = [
  {
    path: "",
    component: EmployeesComponent
  },
  {
    path: "add",
    component: EmployeesAddComponent
  },
  {
    path: "linkGroup/:employee",
    component: LinkGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {}
