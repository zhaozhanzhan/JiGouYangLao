import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceRecordComponent } from './service-record.component';
const routes: Routes = [
  {
    path: '',
    component: ServiceRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRecordRoutingModule { }
