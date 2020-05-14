import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";

import { ServiceRecordRoutingModule } from './service-record-routing.module';
import { ServiceRecordComponent } from './service-record.component';
import { ServiceTypePipe } from './service-type.pipe';

@NgModule({
  imports: [
    CommonModule,
    ServiceRecordRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    ENgxPrintModule
  ],
  declarations: [ServiceRecordComponent, ServiceTypePipe]
})
export class ServiceRecordModule { }
