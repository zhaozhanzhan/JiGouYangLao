import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";

import { ServiceProjectRoutingModule } from './service-project-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectIconComponent } from './project-icon/project-icon.component'; 

@NgModule({
  imports: [
    CommonModule,
    ServiceProjectRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule
  ],
  declarations: [ProjectListComponent, ProjectAddComponent, ProjectIconComponent]
})
export class ServiceProjectModule { }
