import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckComponent } from './check/check.component';
import { ServiceChangeComponent } from './list/service-change.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceChangeComponent,
  },
  {
    path: 'check/:id',
    component: CheckComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoInterviewRoutingModule {}
