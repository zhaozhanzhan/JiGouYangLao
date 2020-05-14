import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentComponent } from './department.component';
import { DepartmentRoutingModule } from './department-routing.module';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../common/common.module';
import { DepartmentAddEditComponent } from './department-add-edit/department-add-edit.component';

@NgModule({
	imports: [
		NgbModule,
		DepartmentRoutingModule,
		HttpModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgZorroAntdModule,
		MirrortechCommonModule
	],
	providers: [],
	declarations: [ DepartmentComponent, DepartmentAddEditComponent ]
})
export class DepartmentModule {}
