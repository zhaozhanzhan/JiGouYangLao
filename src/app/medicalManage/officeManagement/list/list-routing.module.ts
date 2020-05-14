import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list.component';
import { AddEditComponent } from './addEdit/addEdit.component';
const routes: Routes = [
  {
    path:'',
    component:ListComponent
  },
  {
    path:'addEdit',
    component:AddEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class officeListRoutingModule { }
