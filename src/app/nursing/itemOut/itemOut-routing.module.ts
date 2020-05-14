import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckRecordCheckComponent } from './check/checkrecord-check.component';
import { ItemOutComponent } from './itemOut.component';
import { CheckOutComponent } from './checkOut/checkOut.component';


const routes: Routes = [
  {
    path: '',
    component: ItemOutComponent,
  },
  {
    path: 'check',
    component: CheckRecordCheckComponent,
  }
  ,
  {
    path: 'checkOut',
    component: CheckOutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemOutRoutingModule {}
