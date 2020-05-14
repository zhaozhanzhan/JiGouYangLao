import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectIconComponent } from './project-icon/project-icon.component';
const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent
  },
  {
    path: 'add',
    component: ProjectAddComponent
  },
  {
    path: 'icon',
    component: ProjectIconComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceProjectRoutingModule { }
