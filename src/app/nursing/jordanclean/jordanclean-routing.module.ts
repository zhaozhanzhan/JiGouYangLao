import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JordanCleanComponent } from './list/jordanclean.component';

const routes: Routes = [
  {
    path: '',
    component: JordanCleanComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JordanCleanRoutingModule {}
