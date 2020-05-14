import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShpeMemoComponent } from './list/shpememo.component';

const routes: Routes = [
  {
    path: '',
    component: ShpeMemoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShpeMemoRoutingModule {}
