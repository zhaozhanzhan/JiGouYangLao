import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstCareComponent } from './first-care.component'
const routes: Routes = [
  {
    path:'',
    component: FirstCareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstCareRoutingModule { }
