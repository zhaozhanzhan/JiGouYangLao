import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentComponent } from './department.component';
import { DepartmentAddEditComponent } from './department-add-edit/department-add-edit.component';

const routes: Routes = [
	{
		path: '',
		component: DepartmentComponent
	},
	{
		path: 'addEdit',
		component: DepartmentAddEditComponent
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DepartmentRoutingModule {}
