import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { EmployeesGroupComponent } from './list/employeesGroup.component';
import { EmployeesGroupRoutingModule } from './employeesGroup-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesGroupAddComponent } from './add/employeesGroup-add.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../../common/common.module';

@NgModule({
  imports: [
    EmployeesGroupRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [EmployeesGroupComponent, EmployeesGroupAddComponent]
})
export class EmployeesGroupModule {}
