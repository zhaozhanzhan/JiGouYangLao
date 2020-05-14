import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NurseGroupComponent } from './nurse-group.component';
import { NurseGroupAddComponent } from './add/nurseGroup-add.component';

const routes: Routes = [
  {
    path: '',
    component: NurseGroupComponent,
  },
  {
    path: 'add',
    component: NurseGroupAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NurseManagementRoutingModule { }