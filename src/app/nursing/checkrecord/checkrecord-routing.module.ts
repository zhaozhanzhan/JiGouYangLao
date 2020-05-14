import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckRecordComponent } from './list/checkrecord.component';
import { CheckRecordCheckComponent } from './check/checkrecord-check.component';

const routes: Routes = [
  {
    path: '',
    component: CheckRecordComponent,
  },
  {
    path: 'check/:checkRecord',
    component: CheckRecordCheckComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckRecordRoutingModule {}
