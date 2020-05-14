import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildingCodeComponent } from './buildingCode.component';

const routes: Routes = [
  {
    path: '',
    component: BuildingCodeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingCodeRoutingModule { }
