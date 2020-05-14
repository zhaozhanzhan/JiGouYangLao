import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ENgxPrintModule } from "e-ngx-print";
import { FirstCareRoutingModule } from './first-care-routing.module';
import { FirstCareComponent } from './first-care.component'
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
@NgModule({
  imports: [
    CommonModule,
    ENgxPrintModule,
    FirstCareRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MirrortechCommonModule,
    NgZorroAntdModule
  ],
  declarations: [FirstCareComponent],
  exports: [FirstCareComponent],
})
export class FirstCareModule { }
