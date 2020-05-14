import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationalManageComponent } from './organizationalManage.component';


const routes: Routes = [
  {
    path: '',
    component: OrganizationalManageComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationalManageRoutingModule {}
