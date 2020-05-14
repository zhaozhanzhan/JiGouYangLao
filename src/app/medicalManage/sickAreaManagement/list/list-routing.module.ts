import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list.component';
import { EmployeesGroupAddComponent } from './add/employeesGroup-add.component';
const routes: Routes = [
  {
    path:'',
    component:ListComponent
  },
  {
    path:'add',
    component:EmployeesGroupAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
