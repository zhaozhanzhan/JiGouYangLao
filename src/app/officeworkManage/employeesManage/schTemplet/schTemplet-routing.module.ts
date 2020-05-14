import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchTempletComponent } from './list/schTemplet.component';
import { SchTempletAddComponent } from './add/schTemplet-add.component';

const routes: Routes = [
  {
    path: '',
    component: SchTempletComponent,
  },
  {
    path: 'add',
    component: SchTempletAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchTempletRoutingModule {}
