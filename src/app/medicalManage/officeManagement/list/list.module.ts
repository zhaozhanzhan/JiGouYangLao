import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { officeListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './addEdit/addEdit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../../common/common.module';
@NgModule({
  imports: [
    CommonModule,
    officeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  declarations: [ListComponent,AddEditComponent]
})
export class officeListModule { } 
