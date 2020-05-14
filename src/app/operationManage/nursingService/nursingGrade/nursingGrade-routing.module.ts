import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NursingGradeComponent } from './nursingGrade.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    component: NursingGradeComponent,
  },
  {
    path: 'info',
    component: InfoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NursingGradeRoutingModule {}
