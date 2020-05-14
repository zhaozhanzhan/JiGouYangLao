import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResMemoComponent } from './list/resmemo.component';
import { CheckComponent } from './check/check.component';

const routes: Routes = [
  {
    path: '',
    component: ResMemoComponent,
  },
  {
    path: 'check/:resMemo',
    component: CheckComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResMemoRoutingModule {}
