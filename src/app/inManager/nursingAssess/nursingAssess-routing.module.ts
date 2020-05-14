import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NursingAssessComponent } from './nursingAssess.component';
import { ApplyComponent } from './apply/apply.component';
import { AssessmentComponent } from './assessment/assessment.component';

const routes: Routes = [
  {
    path: '',
    component: NursingAssessComponent,
  },
  {
    path: 'apply',
    component: ApplyComponent,
  },
  {
    path: 'assessment/:id',
    component: AssessmentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NursingAssessRoutingModule {}