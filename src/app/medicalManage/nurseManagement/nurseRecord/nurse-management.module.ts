import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NurseManagementRoutingModule } from './nurse-management-routing.module';
import { NurseManagementComponent } from './nurse-management.component';
import { NgZorroAntdModule } from "ng-zorro-antd";

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../../common/common.module";
import { LinkGroupComponent } from "./linkGroup/linkGroup.component";
import { EmployeesAddComponent } from "./add/employees-add.component";
@NgModule({
  imports: [
    CommonModule,
    NurseManagementRoutingModule,
    NgZorroAntdModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MirrortechCommonModule
  ],
  declarations: [
    NurseManagementComponent,
    LinkGroupComponent,
    EmployeesAddComponent
  ]
})
export class NurseManagementModule { }
