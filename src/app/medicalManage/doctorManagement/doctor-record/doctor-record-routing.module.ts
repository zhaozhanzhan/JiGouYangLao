import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorRecordComponent } from './doctor-record.component';
import { EmployeesAddComponent } from "./add/employees-add.component";
const routes: Routes = [
  {
    path:'',
    component:DoctorRecordComponent
  },{
    path:'add',
    component:EmployeesAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRecordRoutingModule { }
