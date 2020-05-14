import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { AddEditComponent } from './addEdit/addEdit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../common/common.module';
import { PropertyRoutingModule } from './property-routing.module';
import { PropertyStatePipe } from './list/propertyStatePipe';
import { DepartmentPipe } from './list/departmentPipe';
import { PropertyStatisticComponent } from './statistic/statistic.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    PropertyRoutingModule
  ],
  declarations: [ListComponent, AddEditComponent, PropertyStatePipe, DepartmentPipe, PropertyStatisticComponent]
})
export class PropertyModule { }
