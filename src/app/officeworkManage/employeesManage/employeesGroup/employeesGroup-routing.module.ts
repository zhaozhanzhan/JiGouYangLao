import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesGroupComponent } from './list/employeesGroup.component';
import { EmployeesGroupAddComponent } from './add/employeesGroup-add.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesGroupComponent,
  },
  {
    path: 'add',
    component: EmployeesGroupAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesGroupRoutingModule {}
