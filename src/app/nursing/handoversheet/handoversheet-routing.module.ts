import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HandoverSheetComponent } from './list/handoversheet.component';

const routes: Routes = [
  {
    path: '',
    component: HandoverSheetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandoverSheetRoutingModule {}
