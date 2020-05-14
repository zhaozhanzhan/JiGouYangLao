import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResCaseComponent } from './resCase.component';

const routes: Routes = [
  {
    path: '',
    component: ResCaseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResCaseRoutingModule {}
