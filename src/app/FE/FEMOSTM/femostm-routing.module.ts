import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CloseAccountComponent } from './close-account/close-account.component';
import { AddComponent } from '../FECSM/add/add.component';
const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'closeAccount',
    component: CloseAccountComponent
  },
  {
    path: 'add/:info',
    component: AddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FEMOSTMRoutingModule { }
