import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NurseManagementComponent } from './nurse-management.component';
import { LinkGroupComponent } from "./linkGroup/linkGroup.component";
import { EmployeesAddComponent } from "./add/employees-add.component";
const routes: Routes = [
  {
    path: '',
    component: NurseManagementComponent,
  },
  {
    path: "linkGroup/:employee",
    component: LinkGroupComponent
  },
  {
    path: "add",
    component: EmployeesAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NurseManagementRoutingModule { }
