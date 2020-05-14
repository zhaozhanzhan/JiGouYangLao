import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './addEdit/addEdit.component';
import { PropertyStatisticComponent } from './statistic/statistic.component';
const routes: Routes = [
  {
    path:'details',
    component:ListComponent
  },
  {
    path:'addEdit',
    component:AddEditComponent
  },
  {
    path:'statistic',
    component: PropertyStatisticComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
