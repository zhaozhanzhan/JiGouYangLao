import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { PaidComponent } from './paid/paid.component';
const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },{
    path: 'detail',
    component: DetailComponent
  },{
    path: 'paid',
    component: PaidComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRegisterRoutingModule { }
