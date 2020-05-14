import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RollMemoComponent } from './list/rollmemo.component';

const routes: Routes = [
  {
    path: '',
    component: RollMemoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RollMemoRoutingModule {}
