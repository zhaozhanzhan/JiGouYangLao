import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResCaseBaseComponent } from './resCaseBase.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    component: ResCaseBaseComponent
  },
  {
    path: 'info',
    component: InfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResCaseBaseRoutingModule {}
