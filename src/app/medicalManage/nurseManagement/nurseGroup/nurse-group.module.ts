import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NurseManagementRoutingModule } from './nurse-group-routing.module';
import { NurseGroupComponent } from './nurse-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MirrortechCommonModule } from '../../../common/common.module';
import { NurseGroupAddComponent } from './add/nurseGroup-add.component';

@NgModule({
  imports: [
    CommonModule,
    NurseManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  declarations: [NurseGroupComponent,NurseGroupAddComponent]
})
export class NurseGroupModule { }
