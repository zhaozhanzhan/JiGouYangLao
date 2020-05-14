import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfollowComponent } from './infollow/infollow.component';
import { DetailComponent } from './infollow/detail/detail.component';
const routes: Routes = [
  {
    path: 'infollow',
    component: InfollowComponent
  },
  {
    path: 'detail',
    component: DetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfollowRoutingModule { }
