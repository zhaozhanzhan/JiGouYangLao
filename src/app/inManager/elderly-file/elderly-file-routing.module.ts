import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElderlyFileComponent } from './list/elderly-file-list.component';
import { ElderInfoComponent } from './elder-info/elder-info.component';

const routes: Routes = [
  {
    path: '',
    component: ElderlyFileComponent,
    data: { title: "住院档案" }
  },
  {
    path: 'elderInfo/:id',
    component: ElderInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElderlyFileRoutingModule {}
