import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchedulesComponent } from './list/schedules.component';
import { SchedulesAddComponent } from './add/schedules-add.component';

const routes: Routes = [
  {
    path: '',
    component: SchedulesComponent,
  },
  {
    path: 'add',
    component: SchedulesAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule {}
