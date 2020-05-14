import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRecordRoutingModule } from './doctor-record-routing.module';
import { DoctorRecordComponent } from './doctor-record.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../../common/common.module";
import { EmployeesAddComponent } from "./add/employees-add.component";
@NgModule({
  imports: [
    CommonModule,
    DoctorRecordRoutingModule,
    NgZorroAntdModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MirrortechCommonModule
  ],
  declarations: [DoctorRecordComponent,EmployeesAddComponent]
})
export class DoctorRecordModule { }
