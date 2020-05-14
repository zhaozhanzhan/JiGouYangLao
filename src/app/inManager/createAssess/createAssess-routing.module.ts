import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAssessComponent } from './createAssess.component';
import { ApplyComponent } from './apply/apply.component';

const routes: Routes = [
  {
    path: '',
    component: CreateAssessComponent,
  },
  {
    path: 'apply',
    component: ApplyComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateAssessRoutingModule {}