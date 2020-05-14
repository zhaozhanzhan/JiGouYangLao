import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrativeOfficesComponent } from './administrativeOffices.component';
import { AddEditComponent } from './addEdit/addEdit.component';
import { CheckComponent } from './check/check.component';




const routes: Routes = [
  {
    path: '',
    component: AdministrativeOfficesComponent,
  },
  {
    path: 'addEdit',
    component: AddEditComponent,
  },
  {
    path: 'check',
    component: CheckComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativeOfficesRoutingModule {}
